import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.post("/game", async (req, res) => {
  const { player1Name, player2Name, rounds } = req.body;
  console.log("rounds: ", rounds);
  const player1Wins = rounds.filter((r) => r.winner === player1Name).length;
  const player2Wins = rounds.filter((r) => r.winner === player2Name).length;

  const winner =
    player1Wins > player2Wins
      ? player1Name
      : player2Wins > player1Wins
      ? player2Name
      : "Tie";

  try {
    // Insert the players and the final winner into the `Game` table

    const playerResult = await prisma.game.create({
      data: {
        player1_name: player1Name,
        player2_name: player2Name,
        winner,
      },
      select: {
        id: true,
      },
    });

    console.log(playerResult);

    const game_id = playerResult.id;

    // Insert each round result into the `Round` table
    for (let i = 0; i < rounds.length; i++) {
      const round = await prisma.round.create({
        data: {
          game_id,
          round: rounds[i].round,
          player1_choice: rounds[i].player1Choice,
          player2_choice: rounds[i].player2Choice,
          round_winner: rounds[i].winner,
        },
      });

      console.log("round : => ", round);
    }

    res.status(201).send("Game and rounds saved successfully");
  } catch (error) {
    console.error("Error saving game and rounds:", error);
    res.status(500).send("Error saving game and rounds");
  }
});

// Route to fetch all games with the final winner
app.get("/games", async (req, res) => {
  try {
    const result = await prisma.game.findMany();
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).send("Error fetching games");
  }
});

// =============================================================================================================================

// other database operations

async function groupByChoice() {
  const result = await prisma.round.groupBy({
    by: ["player1_choice", "player2_choice"],
    _count: true,
  });

  console.log("group by Choices made : ", result);
  console.log("=====================================================");
}

groupByChoice();

// -----------------------------------------------------------------

async function groupByResult() {
  const result = await prisma.game.groupBy({
    by: ["winner"],
    _count: true,
  });

  console.log("Grouped based on results => ", result);
  console.log("=====================================================");
}

groupByResult();

// Join tables

const joins = async () => {
  //   const findMany = await prisma.round.findMany({
  //     include: {
  //       game: true,
  //     },
  //   });

  // const findUnique = await prisma.game.findUnique({
  //   where: {
  //     id: 1,
  //   },
  //   include: {
  //     rounds: {
  //       take: 3,
  //       skip: 2,
  //     },
  //   },
  // });

  // join

  console.log("result :: =>");

  // console.log("findMany  ==> ", findMany);

  console.log("=====================================================");

  // console.log("findUnique ==> ", findUnique);

  console.log("=====================================================");
};

joins();

app.listen(5000, () => {
  console.log("Server is running on port 3000");
});
