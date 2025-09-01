import json
import sys

def transform_notes(input_stream):
    # Load the input JSON data from the stream
    data = json.load(input_stream)

    # Get ticks per quarter note
    ticks_per_quarter = data['ticks_per_quarter']

    # Initialize a dictionary to hold notes for each section
    section_notes = {}

    # Transform the notes and organize them by section
    for note in data['notes']:
        note_name = note['note_name']
        duration_beats = note['duration_ticks'] / ticks_per_quarter

        # Determine the section for this note based on its start tick
        section_name = "verse"  # Default section
        for section in data.get('sections', []):
            if note['start_tick'] >= section['tick']:
                section_name = section['name']

        # Add the note to the appropriate section
        if section_name not in section_notes:
            section_notes[section_name] = []
        section_notes[section_name].append([note_name, duration_beats])

    # Create the new structure
    transformed_data = {
        "metadata": {
            "startX": 100,
            "endX": 650,
            "sections": ["verse", "chorus","bridge"],
        },
        "music": {
            section_name: [
                {
                    "lyric": "",
                    "notes": notes
                }
            ] for section_name, notes in section_notes.items()
        }
    }

    return transformed_data

def main():
    if len(sys.argv) > 2:
        print("Usage: python3 transform_notes.py [<input_json_file>]", file=sys.stderr)
        sys.exit(1)

    if len(sys.argv) == 2:
        input_json_file = sys.argv[1]
        with open(input_json_file, 'r') as input_stream:
            transformed_data = transform_notes(input_stream)
    else:
        # Read from standard input if no file is provided
        transformed_data = transform_notes(sys.stdin)

    # Print the transformed data to the command line with compact formatting
    print("", json.dumps(transformed_data, separators=(',', ':')))

if __name__ == "__main__":
    main()
