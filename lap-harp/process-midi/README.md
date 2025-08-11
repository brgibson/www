## Syntax

Usage:
```
./process_midi.sh <file>.mid
./process_midi.sh <file>.mid --debug
```

Example:
```
./process_midi.sh my-heart-will-go-on.mid
./process_midi.sh my-heart-will-go-on.mid --debug
```

## Helpers Files

* `midiparse_to_json.py` - takes a simple midi file and transforms to unoptimized json
* `transform_notes.py` - takes the unoptimized json and optimizes for consumption by the google script

