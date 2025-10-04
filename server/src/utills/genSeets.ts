export const generateSeats = (rows: number, seatsPerRow: number) => {
  const seatLayout: { seatLabel: string; isBooked: boolean }[] = [];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < rows; i++) {
    for (let j = 1; j <= seatsPerRow; j++) {
      seatLayout.push({
        seatLabel: `${alphabet[i]}${j}`,
        isBooked: false,
      });
    }
  }

  return seatLayout;
};
