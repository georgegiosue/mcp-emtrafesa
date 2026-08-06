import type { Terminal } from "../models/emtrafesa.model";

export class TerminalDirectory {
  private constructor(
    private readonly terminals: Terminal[],
    private readonly role: string,
  ) {}

  static origins(terminals: Terminal[]): TerminalDirectory {
    return new TerminalDirectory(terminals, "origin");
  }

  static destinationsFrom(
    origin: Terminal,
    terminals: Terminal[],
  ): TerminalDirectory {
    return new TerminalDirectory(
      terminals,
      `destination reachable from ${origin.name}`,
    );
  }

  resolve(cityName: string): Terminal {
    const wanted = TerminalDirectory.normalize(cityName);

    const exact = this.terminals.filter(
      (terminal) => TerminalDirectory.normalize(terminal.name) === wanted,
    );

    if (exact.length === 1 && exact[0]) {
      return exact[0];
    }

    const partial = this.terminals.filter((terminal) =>
      TerminalDirectory.normalize(terminal.name).includes(wanted),
    );

    if (partial.length === 1 && partial[0]) {
      return partial[0];
    }

    if (partial.length > 1) {
      throw new Error(
        `"${cityName}" matches more than one ${this.role}: ${TerminalDirectory.nameList(partial)}. Ask which one is meant.`,
      );
    }

    throw new Error(
      `No ${this.role} named "${cityName}". Available: ${TerminalDirectory.nameList(this.terminals)}.`,
    );
  }

  private static nameList(terminals: Terminal[]): string {
    return terminals.map((terminal) => terminal.name).join(", ");
  }

  private static normalize(value: string): string {
    return value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toUpperCase()
      .replace(/\s+/g, " ")
      .trim();
  }
}
