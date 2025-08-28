#!/bin/bash

# Initialize variables
DEBUG=false
INPUT_MIDI_FILE=""

# Parse arguments
for arg in "$@"; do
  case $arg in
    --debug)
      DEBUG=true
      ;;
    *)
      INPUT_MIDI_FILE="$arg"
      ;;
  esac
done

# Check for input MIDI file
if [ -z "$INPUT_MIDI_FILE" ]; then
  echo "Usage: $0 [--debug] <input_midi_file>"
  exit 1
fi

# Create a temporary file with a .json suffix in the current directory
TEMP_FILE=$(mktemp ./tmp.XXXXXXXXXX)
TEMP_JSON_FILE_NAME="${TEMP_FILE}.json"
rm $TEMP_FILE

# Run the first script and save output to a temporary file
python3 midiparse_to_json.py "$INPUT_MIDI_FILE" > "$TEMP_JSON_FILE_NAME"

# Run the second script, reading from the temporary file and outputting to stdout
python3 transform_notes.py < "$TEMP_JSON_FILE_NAME"

# Remove the temporary file unless in debug mode
if [ "$DEBUG" = false ]; then
  rm "$TEMP_JSON_FILE_NAME"
else
  echo "Debug mode: Temporary file retained at $TEMP_JSON_FILE_NAME"
  open $TEMP_JSON_FILE_NAME
fi
