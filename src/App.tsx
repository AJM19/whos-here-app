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
    await updateSquare({ id: id, value: value });
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
        }}
      >
        <Title>See who's here...</Title>
        <p style={{ color: "black", textAlign: "center" }}>
          Each update is from someone else using the site, who's on the other
          end?
        </p>
      </div>

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
  width: 100%;
  border-radius: 0;
  border: 1px solid lightgrey;

  img {
    height: 100%;
    width: 100%;
    object-fit: scale-down;
    object-position: center;
    opacity: 0;

    transition: opacity 0.5s ease-in-out;
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
