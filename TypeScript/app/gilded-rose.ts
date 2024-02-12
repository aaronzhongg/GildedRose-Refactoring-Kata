const MaximumQuality = 50;
const MinimumQuality = 0;

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name: string, sellIn: number, quality: number) {
    if (quality < MinimumQuality || quality > MaximumQuality)
      throw new Error("Quality must be between 0 and 50");

    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }

  updateQuality() {
    if (this.quality == MinimumQuality) return;

    if (this.sellIn > 0) {
      this.quality = this.quality - 1;
    } else {
      this.quality = this.quality - Math.min(this.quality, 2);
    }
  }

  updateSellIn() {
    this.sellIn = this.sellIn - 1;
  }
}

export class AgedBrie extends Item {
  updateQuality(): void {
    if (this.quality == MaximumQuality) return;

    if (this.sellIn < 1) {
      this.quality = this.quality + 2; // More aged brie is sought after, so quality increases at a faster rate after sellIn date passes
    } else {
      this.quality = this.quality + 1;
    }
  }

  constructor(sellIn: number, quality: number) {
    super("Aged Brie", sellIn, quality);
  }
}

export class Sulfuras extends Item {
  updateQuality(): void {
    return;
  }

  updateSellIn(): void {
    return;
  }

  constructor() {
    super("Sulfuras, Hand of Ragnaros", 0, MaximumQuality); // Sulfuras never has to be sold, and it's quality never decreases

    // Hack: explicitly get around the 50 limit
    // Worthy tradeoff as this is an uncommon case, other items should respect the limit
    this.quality = 80;
  }
}

export class BackstagePass extends Item {
  updateQuality(): void {
    // Concert has passed, there is no value in the ticket anymore
    if (this.sellIn < 1) {
      this.quality = MinimumQuality;
      return;
    }

    if (this.quality == MaximumQuality) return;

    // There is more demand in concert tickets as the concert date approaches, rate of quality increases accordingly
    if (this.sellIn < 6) {
      this.quality = this.quality + Math.min(3, MaximumQuality - this.quality);
    } else if (this.sellIn < 11) {
      this.quality = this.quality + Math.min(2, MaximumQuality - this.quality);
    } else {
      this.quality = this.quality + Math.min(1, MaximumQuality - this.quality);
    }
  }

  constructor(sellIn: number, quality: number) {
    super("Backstage passes to a TAFKAL80ETC concert", sellIn, quality);
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    this.items.forEach((item) => {
      item.updateQuality();

      item.updateSellIn();
    });

    return this.items;
  }
}
