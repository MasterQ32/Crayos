package game

import (
	_ "embed"
	"strings"
)

const (
	// Length of a drawing round in seconds
	GAME_ROUND_TIME_S = 20 // 90

	// Timeout for the showcase duration
	GALLERY_ROUND_TIME_S = 30

	/// Time of a "trolling" time slice
	GAME_TROLL_EFFECT_COOLDOWN_S = 10
)

const (
	VOTE_PROMPT_PROMPT   string = "Select a prompt"
	VOTE_PROMPT_EFFECT   string = "Select a trolling effect"
	VOTE_PROMPT_SHOWCASE string = "Gaze upon this masterpiece"
)

//go:embed drawing_prompts_the_other_kind_of_drawcalls.txt
var fileData []byte
var AVAILABLE_PROMPTS = strings.Split(string(fileData), "\n")
