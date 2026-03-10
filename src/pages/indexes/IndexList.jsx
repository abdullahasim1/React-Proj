import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  loadIndexEntries,
  saveIndexEntries,
  loadIndexMaster,
  saveIndexMaster,
} from "../../utils/indexStorage";

const IndexList = () => {
  const navigate = useNavigate();

  const [entries, setEntries] = useState(loadIndexEntries());
  const [search, setSearch] = useState("");
  const [newIndex, setNewIndex] = useState("");

  const indexes = useMemo(() => {
    const names = [...new Set(entries.map((e) => e.indexName).filter(Boolean))];

    return names.map((name) => {
      const items = entries.filter((e) => e.indexName === name);

      const latest = items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

      return {
        name,
        lastUpdated: latest?.date || "-",
      };
    });
  }, [entries]);

  const filtered = indexes.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );

  const addIndex = () => {
    if (!newIndex.trim()) return;

    const master = loadIndexMaster();

    if (master.includes(newIndex)) {
      alert("Index already exists");
      return;
    }

    const updatedMaster = [...master, newIndex];
    saveIndexMaster(updatedMaster);

    const newEntry = {
      id: Date.now(),
      indexName: newIndex,
      date: new Date().toISOString().slice(0, 10),
      value: "",
      createdAt: new Date().toISOString(),
    };

    const updatedEntries = [...entries, newEntry];

    setEntries(updatedEntries);
    saveIndexEntries(updatedEntries);

    setNewIndex("");
  };

  const deleteIndex = (name) => {
    const confirmDelete = window.confirm("Delete this index?");

    if (!confirmDelete) return;

    const updatedEntries = entries.filter((e) => e.indexName !== name);
    setEntries(updatedEntries);
    saveIndexEntries(updatedEntries);

    const master = loadIndexMaster().filter((i) => i !== name);
    saveIndexMaster(master);
  };

  const editIndex = (name) => {
    const newName = prompt("Enter new name", name);

    if (!newName || newName === name) return;

    const updatedEntries = entries.map((e) =>
      e.indexName === name ? { ...e, indexName: newName } : e,
    );

    setEntries(updatedEntries);
    saveIndexEntries(updatedEntries);

    const master = loadIndexMaster().map((i) => (i === name ? newName : i));

    saveIndexMaster(master);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Index List</Typography>

        <Button variant="outlined" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search index"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TextField
          size="small"
          placeholder="New index name"
          value={newIndex}
          onChange={(e) => setNewIndex(e.target.value)}
        />

        <Button variant="contained" onClick={addIndex}>
          Add Index
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Index Name</b>
                </TableCell>
                <TableCell>
                  <b>Last Updated</b>
                </TableCell>
                <TableCell>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((index) => (
                <TableRow key={index.name}>
                  <TableCell>{index.name}</TableCell>

                  <TableCell>{index.lastUpdated}</TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => editIndex(index.name)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => deleteIndex(index.name)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography align="center">No indexes found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default IndexList;
