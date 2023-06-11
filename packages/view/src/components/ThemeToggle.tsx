import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";

export default function () {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="subtle"
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
      size="sm"
    >
      {dark ? <IconSun size="1rem" /> : <IconMoonStars size="1rem" />}
    </ActionIcon>
  );
}
