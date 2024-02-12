import { Item, GildedRose } from "@/gilded-rose";

describe("Gilded Rose", () => {
  it("should foo", () => {
    const gildedRose = new GildedRose([new Item("foo", 0, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].name).toBe("foo");
  });
});

describe("Normal items", () => {
  it.each([
    [1, 1, 0], // simple
    [1, 10, 9], // higher quality
    [10, 1, 0], // higher sellIn
  ])(
    "should reduce quality by 1 when sell by date not passed",
    (sellIn: number, quality: number, expectedQuality: number) => {
      // Arrange
      const normalItems = [new Item("foo", sellIn, quality)];
      const sut = new GildedRose(normalItems);

      // Act
      const actual = sut.updateQuality();

      // Assert
      expect(actual[0].quality).toBe(expectedQuality);
      // expect(actual[0].quality).toBe(quality - 1); // Opted out of this to be explicit about the expected results - protects against the case if the assertion calculation is hiding false positives
    }
  );

  it.each([
    [0, 10, 8], // 0
    [-1, 10, 8], // negative simple sellIn
    [-365, 5, 3], // high negative sellIn, odd quality
    [-1, 1, 0], // no less than 0 quality
  ])(
    "should reduce quality by 2 when sell by date passed",
    (sellIn: number, quality: number, expectedQuality: number) => {
      // Arrange
      const normalItems = [new Item("foo", sellIn, quality)];
      const sut = new GildedRose(normalItems);

      // Act
      const actual = sut.updateQuality();

      // Assert
      expect(actual[0].quality).toBe(expectedQuality);
    }
  );
});

describe("All items", () => {
  it("should not reduce quality below 0", () => {
    // Arrange
    const normalItems = [new Item("foo", 1, 0)];
    const sut = new GildedRose(normalItems);

    // Act
    const actual = sut.updateQuality();

    // Assert
    expect(actual[0].quality).toBe(0);
  });

  it.each([
    [1, 0],
    [1000, 999],
    [0, -1],
    [-888, -889],
  ])("should reduce sellIn by 1", (sellIn: number, expectedSellIn: number) => {
    // Arrange
    const normalItems = [new Item("foo", sellIn, 1)];
    const sut = new GildedRose(normalItems);

    // Act
    const actual = sut.updateQuality();

    // Assert
    expect(actual[0].sellIn).toBe(expectedSellIn);
  });
});

describe("Aged Brie", () => {
  it("should increase quality by 1", () => {
    // Arrange
    const normalItems = [new Item("Aged Brie", 1, 1)];
    const sut = new GildedRose(normalItems);

    // Act
    const actual = sut.updateQuality();

    // Assert
    expect(actual[0].quality).toBe(2);
  });

  it("should not increase quality above 50", () => {
    // Arrange
    const normalItems = [new Item("Aged Brie", 1, 50)];
    const sut = new GildedRose(normalItems);

    // Act
    const actual = sut.updateQuality();

    // Assert
    expect(actual[0].quality).toBe(50);
  });

  it("should increase quality by 2 after sell by date", () => {
    // Arrange
    const normalItems = [new Item("Aged Brie", -1, 48)];
    const sut = new GildedRose(normalItems);

    // Act
    const actual = sut.updateQuality();

    // Assert
    expect(actual[0].quality).toBe(50);
  });
});

describe("Sulfuras", () => {
  // BUG: Quality can be set to negative
  it.each([-1, 0, 1, 50])("should not change quality", (sulfurasQuality) => {
    // Arrange
    const normalItems = [
      new Item("Sulfuras, Hand of Ragnaros", 0, sulfurasQuality),
    ];
    const sut = new GildedRose(normalItems);

    // Act
    const actual = sut.updateQuality();

    // Assert
    expect(actual[0].quality).toBe(sulfurasQuality);
  });

  // BUG: SellIn can be set to negative
  it.each([-1, 0, 1, 50])("should not change sellIn", (sulfurasSellIn) => {
    // Arrange
    const normalItems = [
      new Item("Sulfuras, Hand of Ragnaros", sulfurasSellIn, 13),
    ];
    const sut = new GildedRose(normalItems);

    // Act
    const actual = sut.updateQuality();

    // Assert
    expect(actual[0].sellIn).toBe(sulfurasSellIn);
  });
});

describe("Backstage passes", () => {
  it("should increase quality by 1 when sellIn > 10", () => {
    // Arrange
    const normalItems = [
      new Item("Backstage passes to a TAFKAL80ETC concert", 11, 1),
    ];
    const sut = new GildedRose(normalItems);

    // Act
    const actual = sut.updateQuality();

    // Assert
    expect(actual[0].quality).toBe(2);
  });

  it.each([
    [10, 1, 3],
    [6, 1, 3],
    [6, 49, 50],
    [6, 50, 50],
  ])(
    "should increase quality by 2 when 10 >= sellIn > 5",
    (sellIn, quality, expectedQuality) => {
      // Arrange
      const normalItems = [
        new Item("Backstage passes to a TAFKAL80ETC concert", sellIn, quality),
      ];
      const sut = new GildedRose(normalItems);

      // Act
      const actual = sut.updateQuality();

      // Assert
      expect(actual[0].quality).toBe(expectedQuality);
    }
  );

  it.each([
    [5, 1, 4],
    [1, 1, 4],
    [1, 48, 50],
    [1, 49, 50],
    [1, 50, 50],
  ])(
    "should increase quality by 3 when 5 >= sellIn > 0",
    (sellIn, quality, expectedQuality) => {
      // Arrange
      const normalItems = [
        new Item("Backstage passes to a TAFKAL80ETC concert", sellIn, quality),
      ];
      const sut = new GildedRose(normalItems);

      // Act
      const actual = sut.updateQuality();

      // Assert
      expect(actual[0].quality).toBe(expectedQuality);
    }
  );

  // BUG: Possible to create a Backstage pass with negative sellIn and positive quality
  it("should drop quality to 0 after sell by date passes", () => {
    // Arrange
    const normalItems = [
      new Item("Backstage passes to a TAFKAL80ETC concert", 0, 10),
    ];
    const sut = new GildedRose(normalItems);

    // Act
    const actual = sut.updateQuality();

    // Assert
    expect(actual[0].quality).toBe(0);
  });
});

describe("Multiple items", () => {
  it("should update multiple items", () => {
    // Arrange
    const items = [
      new Item("foo", 1, 1),
      new Item("Aged Brie", 1, 1),
      new Item("Sulfuras, Hand of Ragnaros", 1, 1),
      new Item("Backstage passes to a TAFKAL80ETC concert", 1, 1),
    ];
    const sut = new GildedRose(items);

    // Act
    const actual = sut.updateQuality();

    // Assert
    expect(actual.length).toBe(4);
    expect(actual[0]).toEqual(new Item("foo", 0, 0));
    expect(actual[1]).toEqual(new Item("Aged Brie", 0, 2));
    expect(actual[2]).toEqual(new Item("Sulfuras, Hand of Ragnaros", 1, 1));
    expect(actual[3]).toEqual(
      new Item("Backstage passes to a TAFKAL80ETC concert", 0, 4)
    );
  });
});

// TODO: Conjured?
