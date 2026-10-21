/* The one raised bead, for the slider thumb and anything else that is a
   handle. The theme's .neu-knob paints the shaded face and rim;
   the lift stays with the caller because only it knows how big its
   handle is (neu-lift-sm under ~30px, neu-lift above). */
const knobFaceClasses = "neu-knob shrink-0"

/* The bead retinted to the accent. */
const knobAccentClasses = "neu-knob shrink-0 [--neu-knob:var(--neu-ring)]"

const knobLiftClasses = "neu-lift"
const knobLiftSmClasses = "neu-lift-sm"

/* The light cap on its eight-stop lift, for the switch thumb, the radio
   indicator and the selected key of a toggle group or tabs. */
const capFaceClasses = "neu-cap shrink-0"
const capLiftClasses = "neu-cap-lift"
const capLiftSmClasses = "neu-cap-lift-sm"

export {
  capFaceClasses,
  capLiftClasses,
  capLiftSmClasses,
  knobAccentClasses,
  knobFaceClasses,
  knobLiftClasses,
  knobLiftSmClasses,
}
