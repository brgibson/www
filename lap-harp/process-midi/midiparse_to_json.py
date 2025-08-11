#!/usr/bin/env python3
"""
midiparse_to_json.py

Single-file MIDI parser (minimal, dependency-free) that outputs JSON of note events.

Usage:
    python3 midiparse_to_json.py input.mid > notes.json
"""

import sys
import struct
import json
import math
from typing import List, Tuple

# ---------- utilities to read bytes ----------
class Reader:
    def __init__(self, data: bytes):
        self.data = data
        self.pos = 0
        self.len = len(data)

    def read(self, n: int) -> bytes:
        if self.pos + n > self.len:
            raise EOFError("unexpected EOF")
        r = self.data[self.pos:self.pos + n]
        self.pos += n
        return r

    def peek(self, n: int = 1) -> bytes:
        if self.pos + n > self.len:
            return b''
        return self.data[self.pos:self.pos + n]

    def eof(self) -> bool:
        return self.pos >= self.len

    def remaining(self) -> int:
        return self.len - self.pos

def read_uint16_be(b: bytes) -> int:
    return struct.unpack(">H", b)[0]

def read_uint32_be(b: bytes) -> int:
    return struct.unpack(">I", b)[0]

def read_varlen(r: Reader) -> int:
    """Read a MIDI variable-length quantity. Returns integer."""
    value = 0
    while True:
        b = r.read(1)[0]
        value = (value << 7) | (b & 0x7F)
        if not (b & 0x80):
            break
    return value

# ---------- note name ----------
NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
def note_number_to_name(n: int) -> str:
    octave = (n // 12) - 1
    name = NOTE_NAMES[n % 12]
    return f"{name}{octave}"

# ---------- main parser ----------
def parse_midi(data: bytes):
    r = Reader(data)

    # Header chunk
    hdr = r.read(4)
    if hdr != b'MThd':
        raise ValueError("Not a MIDI file (missing MThd)")

    hdr_len = read_uint32_be(r.read(4))
    if hdr_len < 6:
        raise ValueError("Bad header length")
    hdr_data = r.read(hdr_len)
    fmt = read_uint16_be(hdr_data[0:2])
    ntrks = read_uint16_be(hdr_data[2:4])
    division = read_uint16_be(hdr_data[4:6])
    if division & 0x8000:
        raise NotImplementedError("SMPTE time division not supported")
    ticks_per_quarter = division

    tracks = []
    tempo_changes = []  # list of (tick, microseconds_per_quarter)
    tempo_changes.append((0, 500000))

    all_notes = []
    sections = []  # To store section names

    for track_index in range(ntrks):
        chunk_id = r.read(4)
        if chunk_id != b'MTrk':
            raise ValueError(f"Expected MTrk, got {chunk_id!r}")
        chunk_len = read_uint32_be(r.read(4))
        track_bytes = r.read(chunk_len)
        tr = Reader(track_bytes)

        abs_tick = 0
        running_status = None
        active_notes = {}

        while not tr.eof():
            delta = read_varlen(tr)
            abs_tick += delta

            b = tr.peek(1)
            if not b:
                break
            status = b[0]
            if status >= 0x80:
                status = tr.read(1)[0]
                running_status = status
            else:
                if running_status is None:
                    raise ValueError("Running status used before status byte")
                status = running_status

            if status == 0xFF:
                meta_type = tr.read(1)[0]
                length = read_varlen(tr)
                data_bytes = tr.read(length)
                if meta_type == 0x51 and length == 3:
                    us_per_qn = int.from_bytes(data_bytes, "big")
                    tempo_changes.append((abs_tick, us_per_qn))
                elif meta_type == 0x03:  # Track name or section name
                    section_name = data_bytes.decode('utf-8')
                    sections.append({"tick": abs_tick, "name": section_name})
                continue
            elif status == 0xF0 or status == 0xF7:
                length = read_varlen(tr)
                _ = tr.read(length)
                continue
            else:
                msg_type = status & 0xF0
                channel = status & 0x0F

                if msg_type in (0x80, 0x90, 0xA0, 0xB0, 0xE0):
                    data1 = tr.read(1)[0]
                    data2 = tr.read(1)[0]
                    if msg_type == 0x90:
                        note = data1
                        vel = data2
                        if vel == 0:
                            key = (channel, note)
                            if key in active_notes:
                                start_info = active_notes.pop(key)
                                note_rec = {
                                    "note_number": note,
                                    "note_name": note_number_to_name(note),
                                    "velocity": start_info["velocity"],
                                    "track": start_info["track"],
                                    "channel": channel,
                                    "start_tick": start_info["start_tick"],
                                    "end_tick": abs_tick,
                                    "duration_ticks": abs_tick - start_info["start_tick"],
                                }
                                all_notes.append(note_rec)
                        else:
                            key = (channel, note)
                            active_notes[key] = {"start_tick": abs_tick, "velocity": vel, "track": track_index}
                    elif msg_type == 0x80:
                        note = data1
                        vel = data2
                        key = (channel, note)
                        if key in active_notes:
                            start_info = active_notes.pop(key)
                            note_rec = {
                                "note_number": note,
                                "note_name": note_number_to_name(note),
                                "velocity": start_info["velocity"],
                                "track": start_info["track"],
                                "channel": channel,
                                "start_tick": start_info["start_tick"],
                                "end_tick": abs_tick,
                                "duration_ticks": abs_tick - start_info["start_tick"],
                            }
                            all_notes.append(note_rec)
                elif msg_type in (0xC0, 0xD0):
                    _ = tr.read(1)
                else:
                    raise ValueError(f"Unknown MIDI message type: {hex(msg_type)} at pos {tr.pos}")

        tracks.append(True)

    if all_notes:
        max_tick = max(n["end_tick"] for n in all_notes)
    else:
        max_tick = 0

    tempo_changes.sort(key=lambda x: x[0])
    if tempo_changes[0][0] != 0:
        tempo_changes.insert(0, (0, 500000))

    pref_seconds = [0.0]
    for i in range(len(tempo_changes) - 1):
        tick_i, us_i = tempo_changes[i]
        tick_next, _ = tempo_changes[i + 1]
        delta_ticks = tick_next - tick_i
        seconds = delta_ticks * (us_i / 1_000_000.0) / ticks_per_quarter
        pref_seconds.append(pref_seconds[-1] + seconds)

    def tick_to_seconds(tick: int) -> float:
        idx = 0
        for i, (t, us) in enumerate(tempo_changes):
            if t <= tick:
                idx = i
            else:
                break
        base_tick, us = tempo_changes[idx]
        base_sec = pref_seconds[idx]
        sec = base_sec + (tick - base_tick) * (us / 1_000_000.0) / ticks_per_quarter
        return sec

    for n in all_notes:
        n["start_seconds"] = tick_to_seconds(n["start_tick"])
        n["duration_seconds"] = tick_to_seconds(n["end_tick"]) - n["start_seconds"]

    return {
        "format": fmt,
        "ntrks": ntrks,
        "ticks_per_quarter": ticks_per_quarter,
        "tempo_changes": [{"tick": t, "us_per_quarter": us} for (t, us) in tempo_changes],
        "notes": all_notes,
        "sections": sections
    }

# ---------- CLI ----------
def main():
    if len(sys.argv) != 2:
        print("Usage: python3 midiparse_to_json.py input.mid", file=sys.stderr)
        sys.exit(2)
    path = sys.argv[1]
    with open(path, "rb") as f:
        data = f.read()
    try:
        parsed = parse_midi(data)
    except Exception as e:
        print("Error parsing MIDI:", e, file=sys.stderr)
        sys.exit(1)
    json.dump(parsed, sys.stdout, indent=2)
    sys.stdout.write("\n")

if __name__ == "__main__":
    main()
