import Grid, { Coordinate } from './grid';

export class AsteroidMap {
  private grid: Grid<string>;

  constructor(mapString: string) {
    this.grid = new Grid<string>();
    const rows = mapString.split('\n');
    rows.forEach((row, y) => {
      const columns = row.split('');
      columns.forEach((value, x) => {
        this.grid.setValue({ x, y }, value);
      });
    });
  }

  public getCoordinate(x: number, y: number): string {
    return this.grid.getValue({ x, y });
  }

  public findBestStation(): [Coordinate, number] {
    const stations = this.grid.findInGrid('#');
    let highestCount = 0;
    let highestStation: Coordinate;

    stations.forEach(station => {
      const count = this.countVisibleStations(station);
      if (count > highestCount) {
        highestCount = count;
        highestStation = station;
      }
    });
    return [highestStation, highestCount];
  }

  public obliterate(station: Coordinate): Coordinate[] {
    let count = 0;
    let previousCount = 0;
    while (count < 200) {
      const visible = this.getVisibleStations(station);
      previousCount = count;
      const stepCount = this.countMarked(visible);
      if (stepCount === 0) {
        break;
      }
      count += stepCount;
      visible.processCells(cell => {
        if (visible.getValue(cell) === 'X') {
          this.grid.setValue(cell, '.');
        }
      });
    }

    return [];
  }

  public countVisibleStations(station: Coordinate) {
    const candidateGrid = this.getVisibleStations(station);
    return this.countMarked(candidateGrid);
  }

  private countMarked(grid: Grid<string>): number {
    return grid.findInGrid('X').length;
  }

  private getVisibleStations(station: Coordinate): Grid<string> {
    const candidateGrid = Grid.fromGrid(this.grid);
    candidateGrid.processSpiral(station, coord => {
      if (candidateGrid.getValue(coord) === '#') {
        candidateGrid.setValue(coord, 'X');
        const matchingSlope = this.getSmallestSlope(coord, station);
        let x = coord.x + matchingSlope.x;
        let y = coord.y + matchingSlope.y;
        while (candidateGrid.getValue({ x, y })) {
          candidateGrid.setValue({ x, y }, 'o');
          x += matchingSlope.x;
          y += matchingSlope.y;
        }
      }
    });
    return candidateGrid;
  }

  private getSmallestSlope(coordOne: Coordinate, coordTwo: Coordinate) {
    const slope = { x: coordOne.x - coordTwo.x, y: coordOne.y - coordTwo.y };
    if (slope.x === 0 && slope.y === 0) {
      return slope;
    }

    if (slope.x === 0) {
      slope.y = slope.y < 0 ? -1 : 1;
      return slope;
    }
    if (slope.y === 0) {
      slope.x = slope.x < 0 ? -1 : 1;
      return slope;
    }

    const simplifiedSlope = this.simplifyFraction(slope.x, slope.y);
    return {
      x: simplifiedSlope[0],
      y: simplifiedSlope[1]
    };
  }

  private simplifyFraction(numerator, denominator) {
    let num = Math.abs(numerator);
    let den = Math.abs(denominator);
    for (let i = Math.max(num, den); i > 1; i--) {
      if (num % i === 0 && den % i === 0) {
        num /= i;
        den /= i;
      }
    }
    num = numerator < 0 ? num * -1 : num;
    den = denominator < 0 ? den * -1 : den;
    return [num, den];
  }
}
