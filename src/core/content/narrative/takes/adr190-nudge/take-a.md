## rung R3 · rung-r3
speaker: kihei
voice: arms
motivates: tab-combat, panel-drill-yard, readout-combat-level, panel-bestiary,
  room-kura

<!--#dawn-comes-grey-through-the-kura-->
> Dawn comes grey through the kura door. The blood on the sill has dried black,
> and most of it is yours. Inside, the rice sits in its rows, untouched, exactly
> as it was put. Sōan has strapped your ribs so tight that breathing is a
> decision.

<!--#kihei-crouches-at-the-sill-a-->
> Kihei crouches at the sill a long time, reading the blood the way Genemon
> reads a column of figures. The trail goes west, into the trees, in drops that
> get no smaller.

<!--#alive-good-->
Kihei: "…Alive. Good."

<!--#for-a-moment-there-is-more-->
> For a moment there is more in him than the verdict. He checks the broken bar
> instead.

<!--#genemon-stands-in-the-doorway-whatever-->
> Genemon stands in the doorway. Whatever he came to say, he writes something in
> the day-book first.

<!--#screen-one-torn-bar-one-broken-->
Genemon: "Screen, one, torn. Bar, one, broken. Grain — none lost. Hand, one.
Standing."

<!--#none-lost-you-think-of-the-->
> None lost. You think of the gnawed seed-bale at the back wall, and the count
> you made twice by lantern, and you do not correct him. Not yet.

<!--#the-bar-was-old-it-goes-->
Genemon: "The bar was old. It goes against the house, not your wage."

<!--#kihei-stands-takes-the-boar-spear-off-->
> Kihei stands, takes the boar-spear off the sill, and puts it back in your
> hands, butt first.

<!--#you-didn-t-win-the-house-->
Kihei: "You didn't win. The house lost nothing. Keep the watch."

<!--#by-evening-the-padded-coat-is-->
> By evening the padded coat is folded at the woodshed step, the torn shoulder
> closed with stitches smaller than the tear deserved. O-Hisa is still three
> steps from the kitchen when you come round the corner, caught.

<!--#it-tore-clean-at-least-if-->
O-Hisa: "It tore clean, at least. If the ribs knit as straight — well."

<!--#she-is-back-inside-before-you-->
> She is back inside before you find anything to say to that.

### ask r3-wolf · "Will it come back?"

<!--#it-left-more-blood-past-the-->
Kihei: "It left more blood past the woodlot than a wolf keeps spare. If the
winter doesn't finish it, it remembers this door. So do you. That makes you
even."

### ask r3-ribs · "How long?"

<!--#breathe-to-the-bottom-of-it-->
Sōan: "Breathe to the bottom of it. Cracked, not broken. Three weeks
strapped, nothing heavier than the lantern, and you come to me before you decide
you are healed."

<!--#he-writes-a-line-in-his-->
> He writes a line in his ledger and closes it when you turn your head.

### ask r3-rice · "The rice?"

<!--#where-it-was-put-last-night-->
Kihei: "Where it was put. Last night's, at least. The rest is the board's
arithmetic, not mine."

### decide · What do you do about the wolf?

#### r3-track · "It bled going west. The trail is fresh."

Sōan: "And you can chase it exactly as far as I can throw you. Sit down. It is
winter's business now, not yours."

memory: kihei +1 (spine)
flags: r3-track

#### r3-hold · "It knows this door now. So do I. I'll be at the sill."

Kihei: "Then mend the bar before dark, and take the long spear this time. Eat
first."

memory: kihei +1 (steady)
flags: r3-hold
bonus: +1 agi — "You stand the sill night after night. Your feet learn the boards
  in the dark; by the fourth night you are up with the long spear before the straw
  has finished settling behind you. (+1 AGI)"

#### r3-mend · "The bar first. Then the wolf."

Genemon: "The bar, the screen, then the tally. I will enter the wood against the
house."

memory: genemon +1 (careful)
flags: r3-mend
