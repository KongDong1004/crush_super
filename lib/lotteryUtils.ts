export type LotteryResult = {
  whiteBalls: number[];
  powerBall: number;
  timestamp: Date;
};

export const generatePowerballNumbers = (): LotteryResult => {
  const whiteBalls = new Set<number>();

  while (whiteBalls.size < 5) {
    // Powerball white balls are 1-69
    const num = Math.floor(Math.random() * 69) + 1;
    whiteBalls.add(num);
  }

  // Powerball red ball is 1-26
  const powerBall = Math.floor(Math.random() * 26) + 1;

  return {
    whiteBalls: Array.from(whiteBalls).sort((a, b) => a - b),
    powerBall,
    timestamp: new Date(),
  };
};
