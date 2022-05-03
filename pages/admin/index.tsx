import {
  Button,
  Card,
  Center,
  Group,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  return (
    <>
      <Center>
        <Card sx={{ width: "40%" }}>
          <Title sx={{ textAlign: "center" }} order={2}>
            Admin Login
          </Title>
          <form>
            <TextInput
              required
              label="Email"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              required
              label="Password"
              {...form.getInputProps("password")}
            />
            <Group position="right" mt="md">
              <Button type="submit" loading={isLoading}>
                Login
              </Button>
            </Group>
          </form>
        </Card>
      </Center>
    </>
  );
};

export default AdminLogin;
