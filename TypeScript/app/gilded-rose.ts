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

  private readonly MaximumQuality = 50;
  private readonly MinimumQuality = 0;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    this.items.forEach((item) => {
      this.updateItemQuality(item);

      this.updateItemSellInDate(item);
    });

    return this.items;
  }

  private updateItemSellInDate(item: Item) {
    if (item.name != "Sulfuras, Hand of Ragnaros")
      item.sellIn = item.sellIn - 1;
  }

  private updateItemQuality(item: Item) {
    switch (item.name) {
      case "Aged Brie":
        if (item.quality == this.MaximumQuality) break;

        if (item.sellIn < 1) {
          item.quality = item.quality + 2; // More aged brie is sought after, so quality increases at a faster rate after sellIn date passes
        } else {
          item.quality = item.quality + 1;
        }

        break;
      case "Backstage passes to a TAFKAL80ETC concert":
        // Concert has passed, there is no value in the ticket anymore
        if (item.sellIn < 1) {
          item.quality = this.MinimumQuality;
          break;
        }

        if (item.quality == this.MaximumQuality) break;

        // There is more demand in concert tickets as the concert date approaches, rate of quality increases accordingly
        if (item.sellIn < 6) {
          item.quality =
            item.quality + Math.min(3, this.MaximumQuality - item.quality);
        } else if (item.sellIn < 11) {
          item.quality =
            item.quality + Math.min(2, this.MaximumQuality - item.quality);
        } else {
          item.quality =
            item.quality + Math.min(1, this.MaximumQuality - item.quality);
        }

        break;
      case "Sulfuras, Hand of Ragnaros":
        break;
      default: // Normal items
        if (item.quality == this.MinimumQuality) break;

        if (item.sellIn > 0) {
          item.quality = item.quality - 1;
        } else {
          item.quality = item.quality - Math.min(item.quality, 2);
        }
        break;
    }
  }
}
