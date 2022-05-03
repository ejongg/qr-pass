import { Burger, Group, Text } from "@mantine/core";
import { FC, useState } from "react";

const Nav: FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <Group position="apart" sx={{}}>
        <Text size="lg">OLRA College Night</Text>
        <Burger
          opened={isNavOpen}
          color="white"
          onClick={() => setIsNavOpen(!isNavOpen)}
        />
      </Group>
    </>
  );
};

export default Nav;
