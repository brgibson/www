const NOTES_TEST = {
  music: {
    "verse": [
      {
        "lyric": "",
        "notes": [
          ["C3", .25], ["D3", .5], ["E3", 1], ["F3", 1.5], ["G3", 2], ["A3", 2.5], ["B3", 3],
          ["C4", 3.5], ["D4", 4], ["E4", 4.5], ["F4", 6], ["G4", 1], ["A4", 1], ["B4", 1], ["C5", 1]
        ]
      },
    ]
  }
};

const MY_HEART_WILL_GO_ON = {
  "metadata": {
    "startX": 145,
    "endX": 495,
    "sections": ["intro","verse", "chorus"],
  },
  "music": {
    "intro": [{
      "lyric": "",
      "notes": [
        ["C4", 1], ["D4", 1], ["D4", 1], ["E4", 7], ["D4", 1], ["C4", 1], ["D4", 1], ["G4", 4.5], ["F4", 1],
        ["E4", 1], ["C4", 2], ["A3", 4], ["F3", 2], ["G3", 5], ["C4", 1], ["D4", 1], ["D4", 1], ["E4", 5],
        ["D4", 1], ["C4", 1], ["D4", 1], ["G4", 5], ["E4", 1], ["G4", 1], ["A4", 4], ["G4", 4], ["D4", 7.5]
      ]
    }],
    "verse": [{
      "lyric": "",
      "notes": [
        ["C4", 3], ["C4", 1], ["C4", 2], ["C4", 2], ["B3", 2], ["C4", 4], ["C4", 2], ["B3", 2], ["C4", 4],
        ["D4", 2], ["E4", 4], ["D4", 4], ["C4", 3], ["C4", 1], ["C4", 2], ["C4", 2], ["B3", 2],
        ["C4", 4], ["C4", 2], ["G3", 8], ["C4", 3], ["C4", 1], ["C4", 2], ["C4", 2], ["B3", 2], ["C4", 4],
        ["C4", 2], ["B3", 2], ["C4", 4.5], ["D4", 2], ["E4", 4.5], ["D4", 4], ["C4", 3], ["C4", 1],
        ["C4", 2], ["C4", 2], ["B3", 2], ["C4", 4], ["C4", 2], ["G3", 13.5]
      ]
    }],
    "chorus": [{
      "lyric": "",
      "notes": [
        ["C4", 4], ["D4", 3],["G3", 1], ["G4", 2], ["F4", 1], ["E4", 1], ["D4", 2], ["E4", 1], ["F4", 1], ["E4", 2], ["D4", 1],
        ["C4", 1], ["B3", 1], ["C4", 2], ["B3", 1], ["A3", 4], ["G3", 4],
        ["C4", 4], ["D4", 3], ["G3", 1], ["G4", 2], ["F4", 1], ["E4", 1], ["D4", 2], ["E4", 1], ["F4", 1],
        ["E4", 2], ["D4", 1], ["C4", 1], ["B3", 1], ["C4", 2], ["B3", 1], ["B3", 1], ["C4", 2], ["D4", 1],
        ["E4", 2], ["D4", 2], ["C4", 8]
      ]
    }]
  }
};

const PIRATES_OF_THE_CARRIBEAN = {"metadata": {
    "startX": 75,
    "endX": 600,
    "sections": ["verse", "chorus"],
  },"music":{"verse":[{"lyric":"","notes":[["E3",0.5],["G3",0.5],["A3",0.5],["A3",0.5],["A3",0.5],["B3",0.5],["C4",0.5],["C4",0.5],["C4",0.5],["D4",0.5],["B3",0.5],["B3",0.5],["A3",0.5],["G3",0.5],["G3",0.5],["A3",0.5],["E3",0.5],["G3",0.5],["A3",0.5],["A3",0.5],["A3",0.5],["B3",0.5],["C4",0.5],["C4",0.5],["C4",0.5],["D4",0.5],["B3",0.5],["B3",0.5],["A3",0.5],["G3",0.5],["A3",0.5],["E3",0.5],["G3",0.5],["A3",0.5],["A3",0.5],["B3",0.5],["C4",0.5],["D4",0.5],["D4",0.5],["D4",0.5],["E4",0.5],["F4",0.5],["F4",0.5],["E4",0.5],["D4",0.5],["E4",0.5],["A3",0.5],["A3",0.5],["B3",0.5],["C4",0.5],["C4",0.5],["D4",0.5],["E4",0.5],["A3",0.5],["A3",0.5],["C4",0.5],["B3",0.5],["A3",0.5],["G3",0.5],["A3",0.5]]}]}};

const SIMPLE_GIFTS = {
  "metadata": {
    "startX": 125,
    "endX": 520,
    "sections": ["verse", "chorus"],
  },
  music: {
    "verse": [
      {
        "lyric": "'Tis the gift to be simple, 'tis the gift to be free",
        "notes": [
          ["G3", 1], ["G3", 1], ["C4", 2], ["C4", 1], ["D4", 1], ["E4", 1], ["C4", 1], ["E4", 1], ["F4", 1], ["G4", 2], ["G4", 1], ["F4", 1], ["E4", 2]
        ]
      },
      {
        "lyric": "'Tis the gift to come down where we ought to be",
        "notes": [
          ["D4", 1], ["C4", 1], ["D4", 2], ["D4", 2],
          ["D4", 2], ["C4", 2], ["D4", 1],
          ["E4", 1], ["D4", 1], ["C4", 1],
          ["G3", 1],
        ]
      },
      {
        "lyric": "And when we find ourselves in the place just right.",
        "notes": [
          ["G3", 1], ["C4", 2], ["C4", 1], ["D4", 1],
          ["E4", 2], ["D4", 1], ["C4", 1],
          ["E4", 2], ["F4", 2], ["G4", 2]
        ]
      },
      {
        "lyric": "It will be in the valley of love and delight",
        "notes": [
          ["F4", .5], ["E4", .5],["D4", 1], ["D4", 1], ["E4", 1],
          ["E4", 1], ["D4", 1], ["C4", 2], ["C4", 2], ["C4", 2]
        ]
      },
      // CHORUS
      {
        "lyric": "When true simplicity is gained",
        "notes": [
          ["G4", 2], ["E4", 2], ["D4", .5], ["E4", .5],
          ["F4", .5], ["E4", .5], ["D4", .5], ["C4", 2]
        ]
      },
      {
        "lyric": "To bow and to bend we shan't be ashamed",
        "notes": [
          ["D4", .5], ["E4", 2], ["E4", 1], ["F4", 1],
          ["G4", 2], ["F4", 1], ["E4", 1], ["D4", 2],
          ["D4", 1], ["E4", 1], ["D4", 2]
        ]
      },
      {
        "lyric": "To turn, turn will be our delight",
        "notes": [
          ["G3", 1], ["C4", 2], ["C4", 2], ["D4", 1],
          ["E4", 2], ["E4", 1], ["F4", 1], ["G4", 2]
        ]
      },
      {
        "lyric": "'Till by turning, turning we come ’round right",
        "notes": [
          ["F4", 1], ["E4", 1], ["D4", 2], ["D4", 2],
          ["E4", 2], ["E4", 1], ["D4", 1], ["C4", 2],
          ["C4", 2], ["C4", 4]
        ]
      }
    ]
  }
};

const THRILLER_MJ_PAGE_1 = {
  "metadata": {
    "startX": 60,
    "endX": 509,
    "sections": ["intro", "verse"],
  }, "music": {
    "intro": [{ "lyric": "",
      "notes": [["D3", 0.25], ["C3", 0.5], ["D3", 0.5], ["F3", 0.5], ["G3", 0.5], ["D3", 1], ["D3", 1],
        ["D3", .25],["C3", 0.5], ["D3", 0.5], ["F3", 0.5], ["G3", 0.25], ["D3", 2]],
    }],
    "verse": [{ "lyric": "",
      "notes": [["C4", 0.5], ["D4", 0.5], ["E4", 0.25], ["F4", 2.0], ["D4", 2.0], ["C4", 0.25], ["D4", 0.5],
        ["C4", 0.5], ["D4", 0.5], ["C4", 0.5], ["D4", 0.5], ["C4", 0.5], ["D4", 0.5], ["F4", 0.25], ["D4", 0.5],
        ["C4", 0.25], ["A3", 4], ["C4", 0.5], ["D4", 0.5], ["E4", 0.25], ["F4", 2.0], ["D4", 2.0], ["C4", 0.25],
        ["D4", 0.5], ["C4", 0.5], ["D4", 0.5], ["C4", 0.5], ["D4", 0.5], ["C4", 0.5], ["D4", 0.5], ["F4", 0.25],
        ["D4", 0.5], ["C4", 0.25], ["A3", 4.0], ["D4", 0.5], ["F4", 0.5], ["A4", 0.25], ["G4", 4.0], ["G4", 0.5],
        ["G4", 0.5], ["F4", 0.5], ["F4", 0.5], ["E4", 0.25], ["E4", 0.5], ["D4", 0.5], ["D4", 0.5], ["E4", 0.25],
        ["F4", 0.5], ["D4", 4.0], ["D4", 0.5], ["F4", 0.5], ["A4", 0.25], ["G4", 4.0], ["G4", 0.25], ["G4", 0.5],
        ["F4", 0.5], ["F4", 0.5], ["E4", 0.25], ["E4", 0.5], ["D4", 0.5], ["D4", 0.5], ["E4", 0.25], ["F4", 2.0],
        ["D4", 0.25], ["F4", 0.5], ["G4", 1], ["A4", 3]],
    }],
  },
};

const THRILLER_MJ_PAGE_2 = {
  "metadata": {
    "startX": 180,
    "endX": 400,
    "sections": ["chorus", "chorus-part-2"],
  }, "music": {
    "chorus": [{
      "lyric": `'Cause this is thriller,\nthriller night\nAnd no one's gonna save you\nFrom the beast about to strike`,
      "notes": [
        ["E4", 0.5], ["G4", 0.5], ["E4", 0.5], ["A4", 1], ["G4", 3], ["G4", 1.0], ["F4", 1.0],
        ["E4", 2], ["E4", 0.5], ["E4", 0.5], ["D4", 0.5], ["D4", 0.5], ["C4", 0.25], ["C4", 0.5], ["A3", 0.5],
        ["C4", 0.5], ["D4", 0.25], ["E4", 0.5], ["D4", 0.5], ["D4", 0.5], ["C4", 0.25], ["C4", 0.5],
      ],
    }],
    "chorus-part-2": [{
      "lyric": "You know it's thriller,\nthriller night\nYou're fighting for your life inside a\nkiller,\nthriller,\now!",
      "notes": [
        ["E4", 0.5], ["G4", 0.5], ["E4", 0.5], ["A4", 1], ["G4", 3], ["G4", 1.0], ["F4", 1.0],
        ["E4", 2], ["E4", 0.5], ["E4", 0.5], ["D4", 0.5], ["D4", 0.5], ["C4", 0.25], ["C4", 0.5], ["A3", 0.5],
        ["C4", 0.5], ["D4", 0.5], ["F3", 0.5], ["C4", 0.5], ["E3", 0.5], ["A3", 1.0], ["E4", 0.5], ["C4", 1.0], ["G3", 0.5], ["G4", 0.5], ["A3", 0.5], ["A4", 4.0]
      ],
    }],
  },
};

const WHOLE_NOTE = "𝅝";
const DOTTED_HALF_NOTE = "𝅗𝅥.";
const HALF_NOTE = "𝅗𝅥";
const DOTTED_QUARTER_NOTE = "𝅘𝅥.";
const QUARTER_NOTE = "𝅘𝅥";
const DOTTED_EIGHTH_NOTE = "𝅘𝅥𝅮.";
const EIGHTH_NOTE = "𝅘𝅥𝅮";
const SIXTEENTH_NOTE = "𝅘𝅥𝅯";

const NOTE_SYMBOL_MAP = {
  4: WHOLE_NOTE,
  3.5: DOTTED_HALF_NOTE,
  3: DOTTED_HALF_NOTE,
  2.5: HALF_NOTE,
  2: HALF_NOTE,
  1.5: DOTTED_QUARTER_NOTE,
  1.25: DOTTED_QUARTER_NOTE,
  1: QUARTER_NOTE,
  0.75: QUARTER_NOTE,
  0.5: EIGHTH_NOTE,
  0.25: SIXTEENTH_NOTE
};

const isNoteDotted = (duration) => {
  return [DOTTED_HALF_NOTE, DOTTED_QUARTER_NOTE, DOTTED_EIGHTH_NOTE].includes(NOTE_SYMBOL_MAP[duration]);
}

const NOTE_POSITION_MAP = {
  "C5": 8.5,
  //
  "B4": 45,
  "A4": 76.5,
  "G4": 116,
  "F4": 147.5,
  "E4": 185.5,
  "D4": 220.5,
  "C4": 258,
  //
  "B3": 290,
  "A3": 324,
  "G3": 359,
  "F3": 398.5,
  "E3": 432,
  "D3": 467.5,
  "C3": 502
};

function insertNotesFromJsonFile() {

  const countNotes = (song) => {
    let total = 0;
    for (const section of Object.values(song)) {
      for (const line of section) {
        total += line.notes.length;
      }
    }
    return total;
  };

  const song = THRILLER_MJ_PAGE_2;

  const presentationId = '1Icl9TS2Pl0NbW8FE1pRsfSIKWPpecTPDHG3iwhtGcuI';
  const slideIndex = 0; // Which slide to insert on

  const presentation = SlidesApp.openById(presentationId);
  const slide = presentation.getSlides()[slideIndex];

  const boxWidth = 60;
  const boxHeight = 40;

  const numNotes = countNotes(song.music);

  /**
   * Favorite [startX, endX] values:
   *
   * -- [50,500]
   * -- [150,500]
   */
  const startX = song?.metadata?.startX || 120;
  const endX = song?.metadata?.endX || 500;;
  const spacingX = endX / numNotes;

  const fontSize = 22;
  const fontFamily = 'Noto Music';

  // Helper to insert a note box
  function insertNoteBox(note, x, y) {
    const box = slide.insertTextBox(note, x, y, boxWidth, boxHeight);
    const text = box.getText();
    text.getTextStyle().setFontSize(fontSize).setFontFamily(fontFamily);
  }

  const insertLine = (x1, y1, x2, y2, { isDotted }) => {
    const line = slide.insertLine(SlidesApp.LineCategory.STRAIGHT, x1, y1, x2, y2);
    line.getLineFill().setSolidFill('#000000');
    if (isDotted) {
      line.setDashStyle(SlidesApp.DashStyle.DOT);
    }
    return line;
  }

  const noteXYs = []

  // Insert all sections (e.g., verse and chorus)
  const sections = song?.metadata?.sections || ['verse', 'chorus'];
  let x = startX;

  for (const sectionName of sections) {
    const section = song.music[sectionName];
    if (!section) continue;

    for (const phrase of section) {
      const notes = phrase.notes;
      const spacing = phrase.spacing || spacingX;

      for (let i = 0; i < notes.length; i++) {
        const [noteName, noteDuration] = notes[i];
        const [prevNoteName, prevNoteDuration] = notes?.[i - 1] || [];

        const isPreviousNoteDotted = isNoteDotted(prevNoteDuration);
        const isPreviousNoteSameName = noteName === prevNoteName;
        const addSpaceBeforeNote = isPreviousNoteDotted && isPreviousNoteSameName

        const noteX = x;
        const noteY = NOTE_POSITION_MAP[noteName] || 0;

        let noteSymbol = NOTE_SYMBOL_MAP[noteDuration] || WHOLE_NOTE;
        if (addSpaceBeforeNote) {
          noteSymbol = ' ' + noteSymbol; // helps to keep the current note from covering the dot of the previous note
        }

        insertNoteBox(noteSymbol, noteX, noteY);

        noteXYs.push({ noteX, noteY, isWholeNote: noteSymbol == WHOLE_NOTE, hasSpaceAddedBeforeNote: addSpaceBeforeNote});

        x += spacing;

        // Draw line to next note if this isn't the last note
        if (noteXYs.length > 1) {
          const lineShiftX = song?.metadata?.lineShiftX || 13;
          const lineShiftY = song?.metadata?.lineShiftY || 17;

          const currentIndex = noteXYs.length - 1;
          const prevIndex = currentIndex - 1;

          const centeroidXNoteA = noteXYs[prevIndex].noteX + lineShiftX  + (noteXYs[prevIndex].hasSpaceAddedBeforeNote ? spacing/2 : 0);
          const centeroidYNoteA = noteXYs[prevIndex].noteY + lineShiftY;
          const centeroidXNoteB = noteXYs[currentIndex].noteX + lineShiftX + (noteXYs[currentIndex].hasSpaceAddedBeforeNote ? spacing/2 : 0);
          const centeroidYNoteB = noteXYs[currentIndex].noteY + lineShiftY;

          const slopeY = centeroidYNoteB - centeroidYNoteA;

          const isSlopeYNegative = slopeY > 0;
          const isSlopeYPositive = slopeY < 0;

          const EXTRA_Y = 16;
          const REDUCE_Y = 13;

          // skip drawing a horizontal line if the notes are too close together (todo: implement width for this when a song comes up)
          if (slopeY != 0) {

            const reduceX = Math.min(Math.max(1, spacingX * .2), 3);

            const reduceY = (isSlopeYNegative ? REDUCE_Y: isSlopeYPositive ? -REDUCE_Y : 0)

            const x1 = centeroidXNoteA + reduceX;
            const y1 = centeroidYNoteA + reduceY + (isSlopeYPositive && noteXYs[prevIndex].isWholeNote ? + EXTRA_Y : 0);

            const x2 = centeroidXNoteB - reduceX;
            const y2 = centeroidYNoteB - reduceY + (isSlopeYNegative && noteXYs[currentIndex].isWholeNote ? + EXTRA_Y : 0);

            insertLine(
              x1,
              y1,
              x2,
              y2,
              { isDotted: i === 0 }
            );
          }
        }
      }

      // Optional: insert lyric label
      // slide.insertTextBox(phrase.lyric, 50, startY - 20, 600, 20)
      //     .getText().getTextStyle().setFontSize(12).setFontFamily(fontFamily);
    }
  };
}
