import { Grid } from "./wires";

describe("wires", () => {
  describe("Grid", () => {
    describe("unit", () => {
      it("adds the wire correctly", () => {
        const grid = new Grid();
        grid.addWire("R75,D30,R83,U83,L12,D49,R71,U7,L72");
        expect(grid.wires[0][75]).toEqual(1);
        expect(grid.wires[24][75]).toEqual(1);
        expect(grid.wires[30][125]).toEqual(1);
      });
    });
    describe("functional", () => {
      it("expected results with given example data - 1", () => {
        const grid = new Grid();
        grid.addWire("R75,D30,R83,U83,L12,D49,R71,U7,L72");
        grid.addWire("U62,R66,U55,R34,D71,R55,D58,R83");
        expect(grid.getSmallestDistance()).toEqual(159);
      });
      it("expected results with given example data - 2", () => {
        const grid = new Grid();
        grid.addWire("R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51");
        grid.addWire("U98,R91,D20,R16,D67,R40,U7,R15,U6,R7");
        expect(grid.getSmallestDistance()).toEqual(135);
      });
    });
  });
});
