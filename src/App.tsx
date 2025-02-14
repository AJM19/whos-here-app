import "./App.css";
import styled from "styled-components";
import {
  useGetSquaresQuery,
  useUpdateSquareMutation,
} from "./queries/whosHereAPI";
import { useEffect, useState } from "react";
import SquareSocket from "./socket";

type Color = "black" | "red" | "blue" | "orange" | "green" | "purple" | "pink";

const COLORS: Color[] = [
  "black",
  "red",
  "blue",
  "orange",
  "green",
  "purple",
  "pink",
];

function App() {
  const { data: squares, refetch } = useGetSquaresQuery();
  const [updateSquare] = useUpdateSquareMutation();

  const [selectedColor, setSelectedColor] = useState<Color>("black");

  const [initials, setInitials] = useState("");

  useEffect(() => {
    SquareSocket.on("update", () => {
      refetch();
    });

    return () => {
      SquareSocket.off("message");
    };
  }, []);

  const clickHandler = async (id: number, value: string) => {
    await updateSquare({ id, value, color: selectedColor });
    SquareSocket.emit("UPDATED", { id, value });
  };

  if (!squares) {
    return <p>Loading...</p>;
  }

  return (
    <StyledContainer>
      <div
        style={{
          position: "sticky",
          top: "0",
          zIndex: "100",
          width: "100%",
          height: "fit-content",
          background: "white",
          justifyItems: "center",
          padding: "10px 0",
        }}
      >
        <Title>See who's here...</Title>
        <p style={{ color: "black", textAlign: "center" }}>
          Each update is from someone else using the site, who's on the other
          end?
        </p>
        <p style={{ color: "black" }}>
          <u>Choose your color:</u>
        </p>
        <div
          style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
        >
          {COLORS.map((color) => (
            <ColorCircle
              onClick={() => setSelectedColor(color)}
              $color={color}
              $selected={color === selectedColor}
            />
          ))}
        </div>
        <p style={{ color: "black" }}>
          <u>Enter Initials Below and Click Away!</u>
        </p>
        <input
          style={{
            background: "white",
            color: selectedColor,
            fontSize: "15pt",
            width: "50px",
            textAlign: "center",
          }}
          maxLength={2}
          onChange={(x) => setInitials(x.target.value)}
        />
      </div>

      <GridContainer>
        {squares.map((sq, i) => (
          <Box
            onClick={() => clickHandler(i + 1, initials)}
            key={i}
            $isActive={sq.value.length > 0}
          >
            <p style={{ color: sq.color }}>{sq.value}</p>
          </Box>
        ))}
      </GridContainer>
    </StyledContainer>
  );
}

export default App;

const StyledContainer = styled.div`
  height: calc(100%- 20px);
  width: 100%;
  padding: 10px 0;
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 20pt;
  text-align: center;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(30, 1fr);
  grid-template-rows: repeat(30, 1fr);

  height: calc(100% - 40px);
  width: calc(100% - 40px);

  margin: 20px;
`;

const Box = styled.button<{ $isActive: boolean }>`
  cursor: pointer;
  position: relative;

  transition: background 0.5s ease-in-out;
  padding: 0;
  height: 100%;
  min-height: 40px;
  width: 100%;
  border-radius: 0;

  p {
    height: 100%;
    width: 100%;
    align-content: center;
    font-weight: bold;
    opacity: 0;
    color: black;
    margin: 0;
    padding: 0;
    margin-block: 0;
    transition: opacity 0.5s ease-in-out, color 0.5s ease-in-out;
  }

  ${({ $isActive }) =>
    $isActive &&
    `
    background: white;

    p {
     opacity: 1;
    }
  `}

  &:hover {
    border: 2px solid black;
  }
`;

const ColorCircle = styled.div<{ $color: string; $selected: boolean }>`
  height: 15px;
  width: 15px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;

  background: ${({ $color }) => $color};

  ${({ $selected }) =>
    $selected &&
    `
    scale: 1.2;
  `}

  transition: scale 0.5s ease-in-out;
`;
