import React from "react";

interface AsciiArtProps {
	art?: "terminal" | "computer" | "robot" | "skull" | "star";
	custom?: string;
	color?: "green" | "amber" | "blue" | "cyan" | "magenta";
	className?: string;
	animated?: boolean;
}

const AsciiArt: React.FC<AsciiArtProps> = ({
	art,
	custom,
	color = "green",
	className = "",
	animated = false,
}) => {
	const getPresetArt = () => {
		switch (art) {
			case "terminal":
				return `
 +-----------------------+
 |  $ _ TERMINAL v1.0    |
 |                       |
 |  > _                  |
 |                       |
 +-----------------------+
        `;

			case "computer":
				return `
  _________________
 /\\                \\
/  \\                \\
|   |  .---------.  |
|   |  |         |  |
|   |  |  KYARA  |  |
|   |  |   KATA  |  |
|   |  |_________|  |
|   |                |
|   |                |
|   |                |
|   |                |
|   |                |
|   |                |
|   |                |
|   \\_______   _____/
|           \\ /     |
|            /      |
|           / \\     |
|__________/   \\____|
        `;

			case "robot":
				return `
     _____
    /     \\
   | () () |
    \\_____/
   ___|_|___
  /         \\
 /|  X   X  |\\
 ||    V    ||
 \\\\  _____ //
  \\___|_|_/
      |
     /|\\
    / | \\
   /  |  \\
        `;

			case "skull":
				return `
     _____
    /     \\
   | () () |
    \\_____/
   ___|_|___
  /    |    \\
 |   __|__   |
 |  /     \\  |
 |  | RIP |  |
 |  \\_____/  |
  \\_________/
        `;

			case "star":
				return `
    *
   ***
  *****
 *******
*********
 *******
  *****
   ***
    *
        `;

			default:
				return "";
		}
	};

	const colorClass = {
		green: "text-[var(--terminal-green)]",
		amber: "text-[var(--terminal-amber)]",
		blue: "text-[var(--terminal-blue)]",
		cyan: "text-[var(--terminal-cyan)]",
		magenta: "text-[var(--terminal-magenta)]",
	}[color];

	const artContent = custom || getPresetArt();

	return (
		<pre
			className={`ascii-logo ${colorClass} ${
				animated ? "animate-pulse" : ""
			} ${className}`}
			dangerouslySetInnerHTML={{ __html: artContent }}
		/>
	);
};

export default AsciiArt;
