import { Service, Inject } from '@lit-kit/di';

export enum ResistorBandColor {
  Black = 'black',
  Brown = 'brown',
  Red = 'red',
  Organge = 'orange',
  Yellow = 'yellow',
  Green = 'green',
  Blue = 'blue',
  Violet = 'violet',
  Grey = 'grey',
  White = 'white',
  Gold = 'gold',
  Silver = 'silver'
}

export interface ResistorBand {
  color: ResistorBandColor;
  value?: number;
  multiplier?: number;
  tolerance?: number;
}

export const Resistor = () => (c: any, k: any, i: any) => Inject(ResistorService)(c, k, i);

@Service()
export class ResistorService {
  private readonly bands: ResistorBand[] = [
    {
      color: ResistorBandColor.Black,
      value: 0,
      multiplier: 1
    },
    {
      color: ResistorBandColor.Brown,
      value: 1,
      multiplier: 10,
      tolerance: 1
    },
    {
      color: ResistorBandColor.Red,
      value: 2,
      multiplier: 100,
      tolerance: 2
    },
    {
      color: ResistorBandColor.Organge,
      value: 3,
      multiplier: 1000
    },
    {
      color: ResistorBandColor.Yellow,
      value: 4,
      multiplier: 10000
    },
    {
      color: ResistorBandColor.Green,
      value: 5,
      multiplier: 100000,
      tolerance: 0.5
    },
    {
      color: ResistorBandColor.Blue,
      value: 6,
      multiplier: 1000000,
      tolerance: 0.25
    },
    {
      color: ResistorBandColor.Violet,
      value: 7,
      multiplier: 10000000,
      tolerance: 0.1
    },
    {
      color: ResistorBandColor.Grey,
      value: 8,
      tolerance: 0.05
    },
    {
      color: ResistorBandColor.White,
      value: 9
    },
    {
      color: ResistorBandColor.Gold,
      multiplier: 0.1,
      tolerance: 5
    },
    {
      color: ResistorBandColor.Silver,
      multiplier: 0.01,
      tolerance: 10
    }
  ];

  getResistorBands(): ResistorBand[] {
    return this.bands;
  }

  getValueBands() {
    return this.bands.filter(b => typeof b.value !== 'undefined');
  }

  getMultiplierBands() {
    return this.bands.filter(b => !!b.multiplier);
  }

  getToleranceBands() {
    return this.bands.filter(b => !!b.tolerance);
  }

  getResistorValue(bands: ResistorBand[], bandLimit: number): string {
    const multiplier = bands[bandLimit - 2];
    const tolerance = bands[bandLimit - 1];

    const value = this.getValue(bands, bandLimit);
    const multiplied = this.multiply(value, multiplier);
    const readableValue = this.getReadableValue(multiplied);

    return this.getTolerance(readableValue, tolerance);
  }

  private getValue(bands: ResistorBand[], bandLimit: number): number {
    return Number(
      bands
        .filter((_: ResistorBand, index: number) => index + 2 < bandLimit)
        .reduce((value: string, band: ResistorBand) => value + band.value, '')
    );
  }

  private multiply(bandValue: number, multiplierBand?: ResistorBand): number {
    if (multiplierBand && multiplierBand.multiplier) {
      return bandValue * multiplierBand.multiplier;
    }

    return bandValue;
  }

  private getReadableValue(bandValue: number): string {
    if (bandValue >= 1000000) {
      return (bandValue / 1000000).toString() + 'M';
    } else if (bandValue >= 1000) {
      return (bandValue / 1000).toString() + 'K';
    } else {
      return bandValue.toString();
    }
  }

  private getTolerance(bandValue: string, toleranceBand: ResistorBand): string {
    if (toleranceBand) {
      return bandValue + ' ±' + toleranceBand.tolerance;
    }

    return bandValue;
  }
}
