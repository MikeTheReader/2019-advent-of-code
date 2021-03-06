export interface Planet {
  name: string;
  orbiters: Planet[];
  orbits: Planet;
}

export class Galaxy {
  private planets;

  constructor() {
    this.planets = {};
  }

  public getRoot(): Planet {
    // tslint:disable-next-line: no-string-literal
    return this.planets['COM'];
  }

  public addOrbit(planetStr: string): void {
    const orbitRegex = /(.*)\)(.*)/;
    const matches = planetStr.match(orbitRegex);
    const name = matches[1];
    const orbiter = matches[2];
    this.planets[name] = this.planets[name] || { name, orbiters: [], orbits: null };
    this.planets[orbiter] = this.planets[orbiter] || { name: orbiter, orbiters: [], orbits: [] };
    this.planets[name].orbiters.push(this.planets[orbiter]);
    this.planets[orbiter].orbits = this.planets[name];
  }

  public countOrbits(): number {
    let count = 0;
    function countOrbitRecursive(planet: Planet) {
      if (planet.orbits) {
        count += 1;
        countOrbitRecursive(planet.orbits);
      }
    }
    Object.values(this.planets).forEach(countOrbitRecursive);
    return count;
  }

  public findDistance(nameOne: string, nameTwo: string) {
    const pathOne = this.getFullPath(nameOne);
    const pathTwo = this.getFullPath(nameTwo);
    const commonAncestor = pathOne.find(name => {
      return pathTwo.indexOf(name) > -1;
    });
    const stepsFromOne = pathOne.indexOf(commonAncestor);
    const stepsFromTwo = pathTwo.indexOf(commonAncestor);
    return stepsFromOne + stepsFromTwo;
  }

  public getFullPath(name: string): string[] {
    const planet = this.planets[name];
    const steps = [];

    function stepBack(planetStep: Planet) {
      steps.push(planetStep.name);
      if (planetStep.orbits) {
        stepBack(planetStep.orbits);
      }
    }
    stepBack(planet.orbits);

    return steps;
  }
}
