import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import ApplicationIcon from "@mui/icons-material/Apps"; // You can choose a more appropriate icon
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import "./logtable.css";
function LogsTable() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const pagesCount = Math.ceil(filteredLogs.length / pageSize);

  useEffect(() => {
    axios
      .get("http://localhost:5272/log")
      .then((response) => {
        setLogs(response.data);
        setFilteredLogs(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the logs", error);
      });
  }, []);
  const getIconForLogName = (logName) => {
    switch (logName) {
      case "System":
        return <SystemUpdateAltIcon />;
      case "Security":
        return <SecurityIcon />;
      case "Application":
        return <ApplicationIcon />;
      default:
        return <AllInclusiveIcon />;
    }
  };
  const filterLogs = (logType) => {
    setCurrentPage(1);
    setFilteredLogs(
      logType === "All" ? logs : logs.filter((log) => log.logName === logType)
    );
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setCurrentPage(1);
    setFilteredLogs(
      logs.filter((log) => log.message.toLowerCase().includes(value))
    );
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <img
            src="/CRYPTTECH_LOGO.svg"
            alt="Logo"
            height={80}
            width={200}
            style={{ marginRight: "10px" }}
          />
          <Typography
            variant="h6"
            style={{ flexGrow: 1, marginRight: "200px", fontWeight: "bold" }}
          >
            Windows Logs Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="20px"
          marginTop="20px"
        >
          <TextField
            label="Search logs"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ width: "60%" }}
          />
          <Box>
            <Button
              variant="contained"
              color="info"
              onClick={() => filterLogs("System")}
              startIcon={<SystemUpdateAltIcon />}
              style={{ marginRight: "10px" }} // Add gap between buttons
            >
              System
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => filterLogs("Security")}
              startIcon={<SecurityIcon />}
              style={{ marginRight: "10px" }}
            >
              Security
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => filterLogs("Application")}
              startIcon={<ApplicationIcon />}
              style={{ marginRight: "10px" }}
            >
              Application
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => filterLogs("All")}
              startIcon={<AllInclusiveIcon />}
            >
              All
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} className="table">
          <Table>
            <TableHead className="table-header">
              <TableRow>
                <TableCell className="table-header-cell">LogName</TableCell>
                <TableCell className="table-header-cell">Timestamp</TableCell>
                <TableCell className="table-header-cell">Source</TableCell>
                <TableCell className="table-header-cell">Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((log, index) => (
                  <TableRow key={index} className="table-row">
                    <TableCell style={{ maxWidth: "50px" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {getIconForLogName(log.logName)}
                        <span style={{ marginLeft: "10px" }}>
                          {log.logName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell style={{ maxWidth: "90px" }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell style={{ maxWidth: "70px" }}>
                      {log.source}
                    </TableCell>
                    <TableCell style={{ maxWidth: "550px" }}>
                      {log.message}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={pagesCount}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
          style={{
            marginTop: "20px",
            justifyContent: "center",
            display: "flex",
          }}
        />
      </div>
    </div>
  );
}

export default LogsTable;
