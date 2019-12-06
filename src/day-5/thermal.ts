export interface Command {
  command: number;
  modes: number[];
}

export interface ProgramResults {
  commands: number[];
  output: number[];
}

const commandArguments = {
  1: 3,
  2: 3,
  3: 1,
  4: 1,
  99: 0
};

export function runProgram(commands: number[], input?: number[]): ProgramResults {
  const output: number[] = [];
  let command: Command;
  let pointer = 0;
  let inputPointer = 0;
  while (true) {
    command = parseOpcode(commands[pointer++]);

    if (command.command === 99) {
      break;
    }
    const args: number[] = [];
    for (let i = 0; i < commandArguments[command.command]; i++) {
      args.push(commands[pointer++]);
    }

    switch (command.command) {
      case 1: {
        const firstOperand = command.modes[0] ? args[0] : commands[args[0]];
        const secondOperand = command.modes[1] ? args[1] : commands[args[1]];
        commands[args[2]] = firstOperand + secondOperand;
        break;
      }
      case 2: {
        const firstOperand = command.modes[0] ? args[0] : commands[args[0]];
        const secondOperand = command.modes[1] ? args[1] : commands[args[1]];
        commands[args[2]] = firstOperand * secondOperand;
        break;
      }
      case 3: {
        commands[args[0]] = input[inputPointer++];
        break;
      }
      case 4: {
        const value = command.modes[0] ? args[0] : commands[args[0]];
        output.push(value);
        break;
      }
      default:
        break;
    }
  }

  return { commands, output };
}

export function parseOpcode(code: number): Command {
  const codeStr = code.toString();
  const command: number = +codeStr.substr(-2);
  const modes: number[] = [];
  // It seems like there should be an easier way to remove the last two digits
  const definedModes: number[] = codeStr.split('').map(x => +x);
  definedModes.pop();
  definedModes.pop();
  for (let i = 0; i < commandArguments[command]; i++) {
    modes.push(definedModes.pop() || 0);
  }

  return {
    command,
    modes
  };
}
