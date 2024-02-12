export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name: string, sellIn: number, quality: number) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    this.items.forEach((item) => {
      switch (item.name) {
        case "Aged Brie":
          if (item.quality >= 50) break;

          if (item.sellIn < 1) {
            item.quality = item.quality + 2;
          } else {
            item.quality = item.quality + 1;
          }

          break;
        case "Backstage passes to a TAFKAL80ETC concert":
          if (item.sellIn < 1) {
            item.quality = 0;
            break;
          }

          if (item.quality == 50) break;

          if (item.sellIn < 6) {
            item.quality = item.quality + Math.min(3, 50 - item.quality);
          } else if (item.sellIn < 11) {
            item.quality = item.quality + Math.min(2, 50 - item.quality);
          } else {
            item.quality = item.quality + Math.min(1, 50 - item.quality);
          }

          break;
        case "Sulfuras, Hand of Ragnaros":
          break;
        default: // Normal items
          if (item.quality == 0) break;

          if (item.sellIn > 0) {
            item.quality = item.quality - 1;
          } else {
            item.quality = item.quality - Math.min(item.quality, 2);
          }
          break;
      }

      if (item.name != "Sulfuras, Hand of Ragnaros")
        item.sellIn = item.sellIn - 1;
    });

    return this.items;
  }
}
