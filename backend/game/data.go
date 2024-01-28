package game

import (
	"embed"
	_ "embed"
	"strings"
	"time"
)

const (
	// Maximum number of players per session
	LIMIT_MAX_PLAYERS int = 4
)

const (
	// Duration for voting the prompt in seconds
	TIME_GAME_PROMPTVOTE_S = 20

	// Duration of a drawing round in seconds
	TIME_GAME_PAINTING_S = 20 // 90

	/// Time of a "trolling" time slice in seconds
	TIME_GAME_NEXT_TROLLEFFECT_S = 10

	// Duration of the stickering phase in seconds
	TIME_GAME_STICKERING_S = 20

	// Duration of the showcase phase in seconds
	TIME_GAME_SHOWCASE_S = 15

	// Duration of the picture rating in seconds
	TIME_GAME_RATING_S = 20

	// Duration of the gallery
	TIME_GAME_GALLERY_S = 20

	/// Time how long a "troll" effect does last in milliseconds
	TIME_GAME_TROLL_EFFECT_DURATION_MS = 5000

	/// Timeout for generic announcements
	TIME_ANNOUNCE_GENERIC time.Duration = 5 * time.Second
)

const (
	// Error messages:
	TEXT_ERROR_SESSION_ONLINE string = "Session is already running."
	TEXT_ERROR_SESSION_FULL   string = "Lobby is already full."

	// Popup messages:
	TEXT_POPUP_START_PAINTING string = "Start painting!"
	TEXT_POPUP_TIMES_UP       string = "Times up!"

	// Vote Prompts:
	TEXT_VOTE_PROMPT   string = "Select a prompt"
	TEXT_VOTE_EFFECT   string = "Select a trolling effect"
	TEXT_VOTE_SHOWCASE string = "Gaze upon this masterpiece"

	// Announcements:
	TEXT_ANNOUNCE_YOU_ARE_TROLL   string = "Chose an image that should be drawn"
	TEXT_ANNOUNCE_YOU_ARE_PAINTER string = "You are the painter. Brace yourself!"
	TEXT_ANNOUNCE_WINNER          string = "And the winner is..."
)

//go:embed drawing_prompts_the_other_kind_of_drawcalls.txt
var fileData []byte
var AVAILABLE_PROMPTS = strings.Split(string(fileData), "\n")

func getStickerStringsArray() []string {
	// game -> backend -> root -> frontend -> img
	// TODO wait for path to images, currently local folder
	//go:embed *
	var fs embed.FS

	filenames, err := fs.ReadDir("files")

	if err != nil {
		panic(err)
	}

	var filenamesSlice []string
	for _, file := range filenames {
		filenamesSlice = append(filenamesSlice, file.Name())
	}
}
