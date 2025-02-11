import "./App.css";
import styled from "styled-components";
import {
  useGetSquaresQuery,
  useUpdateSquareMutation,
} from "./queries/whosHereAPI";
import { useEffect } from "react";
import SquareSocket from "./socket";

function App() {
  const { data: squares, refetch } = useGetSquaresQuery();
  const [updateSquare] = useUpdateSquareMutation();

  useEffect(() => {
    SquareSocket.on("update", () => {
      refetch();
    });

    return () => {
      SquareSocket.off("message");
    };
  }, []);

  const clickHandler = async (id: number, value: boolean) => {
    SquareSocket.emit("UPDATED", { id, value });
    await updateSquare({ id: id, value: value });
  };

  if (!squares) {
    return <p>Loading...</p>;
  }

  return (
    <StyledContainer>
      <Title>See who's here...</Title>
      <GridContainer>
        {squares.map((sq, i) => (
          <Box
            onClick={() => clickHandler(i + 1, !sq.value)}
            key={i}
            $isActive={sq.value}
          >
            <img src="./smiley.png" />
          </Box>
        ))}
      </GridContainer>
    </StyledContainer>
  );
}

export default App;

const StyledContainer = styled.div`
  height: 100%;
  width: 100%;
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

  transition: background 0.75s ease-in-out;
  padding: 0;

  img {
    height: 100%;
    width: 100%;
    object-fit: scale-down;
    object-position: center;
    opacity: 0;

    transition: opacity 0.75s ease-in-out;
  }

  ${({ $isActive }) =>
    $isActive &&
    `
    background: white;

    img {
     opacity: 1;
    }
  `}

  &:hover {
    border: 2px solid black;
  }
`;
