import {
  Button,
  Card,
  Grid,
  Group,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    initialValues: {
      name: "",
      course: "",
      year: "",
    },
  });

  const submit = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      showNotification({
        color: "green",
        title: "Success",
        message: "Thank you for registering to OLRA College Night",
      });
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid>
      <Grid.Col offset={3} span={6}>
        <Card radius="lg" py="lg">
          <Text size="lg" mb="md">
            OLRA College Night Registration Form
          </Text>
          <form onSubmit={form.onSubmit(submit)}>
            <TextInput required label="Name" {...form.getInputProps("name")} />
            <Select
              required
              label="Course"
              data={["BS Entrep", "BS Early Childhood Education"]}
              {...form.getInputProps("course")}
            />
            <Select
              required
              label="Year"
              data={["1", "2", "3", "4"]}
              {...form.getInputProps("year")}
            />

            <Group position="right" mt="md">
              <Button type="submit" loading={isLoading}>
                Register
              </Button>
            </Group>
          </form>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default Home;
