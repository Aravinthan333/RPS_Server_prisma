-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "player1_name" TEXT NOT NULL,
    "player2_name" TEXT NOT NULL,
    "winner" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" SERIAL NOT NULL,
    "round" INTEGER NOT NULL,
    "player1_choice" TEXT NOT NULL,
    "player2_choice" TEXT NOT NULL,
    "round_winner" TEXT NOT NULL,
    "game_id" INTEGER NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
