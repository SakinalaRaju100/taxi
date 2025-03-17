import { useState, useEffect } from "react";

import {
  AppBar,
  AccordionDetails,
  AccordionSummary,
  Accordion,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
  useTheme,
  ThemeProvider,
  createTheme,
  MobileStepper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  TextField,
  TableContainer,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import axios from "axios";

const App = () => {
  const baseURL = "https://www.todaydigitalworld.com";
  const [allData, setAllData] = useState([
    // {
    //   _id: "67d4456b7fa081016611afdb",
    //   mobile: "9676639383",
    //   __v: 0,
    //   active: true,
    //   createdAt: "2025-03-14T15:04:09",
    //   from: "keiy23e6",
    //   location: [17.37231, 78.23],
    //   members: 1,
    //   name: "passenger1",
    //   role: "passenger",
    //   to: "uyf",
    //   updatedAt: "2025-03-14T15:04:09",
    // },
    // {
    //   _id: "67d41cac5a7161d9b891502e",
    //   mobile: "9836934",
    //   __v: 0,
    //   active: true,
    //   createdAt: "2025-03-14T12:10:20",
    //   from: "keiyw2w",
    //   location: [17, 79],
    //   name: "Teja",
    //   role: "taxi",
    //   seats: 1,
    //   to: "uyf",
    //   updatedAt: "2025-03-14T12:32:19",
    //   vehicleNumber: "NA",
    // },
  ]);
  const [currentCoordinates, setCurrentCoordinates] = useState([]);
  const [dialogPopup1, setDialogPopup1] = useState(false);
  const [dialogPopup2, setDialogPopup2] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [availableSeats, setAvailableSeats] = useState(2);
  const [submitted, setSubmitted] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [stops, setStops] = useState([
    { name: "Hanamkonda", distance: 0 },
    { name: "Kazipet", distance: 15 },
    { name: "Ghanpur", distance: 30 },
    { name: "Raghunathpally", distance: 45 },
    { name: "Jangaon", distance: 60 },
    { name: "Aleir", distance: 75 },
    { name: "Bhongiri", distance: 95 },
    { name: "Bibinagar", distance: 105 },
    { name: "Ghatkesar", distance: 115 },
    { name: "Uppal", distance: 130 },
  ]);
  const [userData, setUserData] = useState(null);

  const fetchAllData = async () => {
    const storedData = localStorage.getItem("userObj");
    if (storedData) {
      const userData = JSON.parse(storedData);
      try {
        const response = await axios.post(baseURL + "/api/taxi/get-all", {
          mobile: userData?.mobile,
          role: userData?.role,
        });
        // console.log("Data saved successfully:", response.data);
        await setAllData(response.data.data);

        mapFunc(response.data.data);
      } catch (error) {
        setAllData([]);
        console.error("Error saving data:", error);
      }
    }
  };

  // const mapFunc = async (data) => {
  //   const userLocation = await getCoordinates(); // Ensure coordinates are fetched first
  //   console.log("userLocation", userLocation);

  //   const a = document.getElementById("map");
  //   // console.log("map", a);
  //   a.style.display = "block"; // Show map
  //   // Initialize the Leaflet map
  //   const map = L.map("map").setView(userLocation, 14);

  //   // Add OpenStreetMap tile layer
  //   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //     maxZoom: 17,
  //     attribution: "© OpenStreetMap",
  //   }).addTo(map);

  //   // var marker = L.marker([17.692118, 79.142845])
  //   var marker = L.marker(userLocation).addTo(map).bindPopup(`you`).openPopup();

  //   // console.log("allDatea", allData);

  //   // Add all markers from the allData array

  //   data.forEach((marker) => {
  //     L.marker(marker.location, {
  //       icon: L.icon({
  //         // iconUrl: "./taxi.png",
  //         iconUrl: marker.role == "taxi" ? "./taxi.png" : "./human.png",
  //         // iconUrl: "/redCarTopViewIcon.png",
  //         iconSize: [55, 55],
  //       }),
  //       maxZoom: 5, // Added maxZoom property to markers
  //     })
  //       .addTo(map)
  //       .bindPopup(
  //         // `${marker.name} - ${marker.mobile},  seats: ${marker.seats}`
  //         `${marker.name} - ${marker.mobile} - ${marker.role}`
  //       );
  //     // .openPopup();
  //   });
  // };

  const mapFunc = async (data, userLocation) => {
    const mapElement = document.getElementById("map");

    // Remove existing map instance if it exists
    if (window.mapInstance) {
      window.mapInstance.remove();
    }

    // Show map
    mapElement.style.display = "block";

    // Create new map instance
    const map = L.map("map").setView(userLocation, 15);
    window.mapInstance = map; // Store map instance for future cleanup

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 17,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    // Add user marker
    L.marker(userLocation).addTo(map).bindPopup(`you`).openPopup();

    // Add all other markers
    data.forEach((marker) => {
      L.marker(marker.location, {
        icon: L.icon({
          iconUrl: marker.role == "taxi" ? "./taxi.png" : "./human.png",
          iconSize: [55, 55],
        }),
        maxZoom: 5,
      })
        .addTo(map)
        .bindPopup(`${marker.name} - ${marker.mobile} - ${marker.role}`);
    });
  };

  const sendData = async () => {
    try {
      const userLocation = await getCoordinates(); // Ensure coordinates are fetched first
      console.log("userLocation", userLocation);
      const storedData = localStorage.getItem("userObj");
      if (storedData) {
        const userData = JSON.parse(storedData);

        // console.log("send Data1", userData);

        if (userData?.role == "taxi") {
          const response = await axios.post(
            baseURL + "/api/taxi/add-taxi", // Updated API endpoint
            {
              ...userData, // Use userData to send the required information
              location: userLocation,
              from: userData?.pickupLocation,
              to: userData?.dropLocation,
            }
          );
          // console.log("Data saved successfully:", response.data);
          await setAllData(response.data.data);

          await mapFunc(response.data.data, userLocation);
        } else {
          const response = await axios.post(
            baseURL + "/api/taxi/add-passenger", // Updated API endpoint
            {
              ...userData, // Use userData to send the required information
              location: userLocation,
              from: userData?.pickupLocation,
              to: userData?.dropLocation,
            }
          );
          // console.log("Data saved successfully:", response.data);
          await setAllData(response.data.data);

          await mapFunc(response.data.data, userLocation);
        }
      }
    } catch (error) {
      console.log("No user Data to send");
      console.error("Error saving data:", error);
    }
  };

  useEffect(() => {
    console.log("first useEffect");
    getCoordinatesPermissions();
    const fetchData = async () => {
      const storedData = localStorage.getItem("userObj");
      if (storedData) {
        setUserData(JSON.parse(storedData));
        // const a = document.getElementById("map");
        // a.style.display = "block"; // Show map
        await sendData();
        // await fetchAllData();
      } else {
        const a = document.getElementById("map");
        a.style.display = "none"; // Hide map
      }
    };
    fetchData(); // Call the async function
  }, []);

  const toggleMap = () => {
    const storedData = localStorage.getItem("userObj");
    if (storedData) {
      setUserData(JSON.parse(storedData));
      const a = document.getElementById("map");
      a.style.display = "block";
    } else {
      const a = document.getElementById("map");
      a.style.display = "none";
    }
  };

  // const getCoordinates = async () => {
  //   if (!navigator.geolocation) {
  //     console.error("Geolocation is not supported by this browser.");
  //     alert("Geolocation is not supported by your browser.");
  //     return [];
  //   }

  //   try {
  //     // Check the current permission status
  //     const permissionStatus = await navigator.permissions.query({
  //       name: "geolocation",
  //     });

  //     if (permissionStatus.state === "denied") {
  //       alert(
  //         "Location access is denied. Please enable location access in your browser settings."
  //       );
  //     }

  //     if (permissionStatus.state === "prompt") {
  //       // alert(
  //       //   "This feature requires location access. Please allow it when prompted."
  //       // );
  //     }
  //     // navigator.geolocation.getCurrentPosition();

  //     return new Promise((resolve, reject) => {
  //       navigator.geolocation.getCurrentPosition(
  //         async (position) => {
  //           const { latitude, longitude } = position.coords;
  //           // console.log("Current Coordinates:", latitude, longitude);
  //           setCurrentCoordinates([latitude, longitude]);
  //           resolve([latitude, longitude]);
  //         },
  //         (error) => {
  //           console.error("Error getting location:", error);
  //           if (error.code === error.PERMISSION_DENIED) {
  //             alert("Please allow location access to use this feature.");
  //           }
  //           reject([]);
  //         }
  //       );
  //     });
  //   } catch (error) {
  //     console.error("Error checking location permission:", error);
  //     return [];
  //   }
  // };

  const getCoordinatesPermissions = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by your browser.");
    }

    try {
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });
    } catch (error) {
      console.error("Error checking location permission:", error);
    }
  };
  const getCoordinates2 = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by your browser.");
    }

    try {
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permissionStatus.state === "denied") {
        alert(
          "Location access is denied. Please enable location access in your browser settings."
        );
      }

      // Define positioning options for higher accuracy
      const positionOptions = {
        enableHighAccuracy: true, // Request high accuracy GPS data
        maximumAge: 0, // Don't use cached position data
        timeout: 10000, // Time to wait for position data (10 seconds)
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log("Location accuracy:", accuracy, "meters");

          if (accuracy > 500) {
            // 100 meters threshold, adjust as needed
            console.warn("Low accuracy location data:", accuracy, "meters");
            alert("Low accuracy location data:", accuracy, "meters");
          }

          setCurrentCoordinates([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          if (error.code === error.PERMISSION_DENIED) {
            alert("Please allow location access to use this feature.");
          }
        },
        positionOptions // Add the positioning options
      );
    } catch (error) {
      console.error("Error checking location permission:", error);
    }
  };
  const getCoordinates = async () => {
    try {
      // Define positioning options for higher accuracy
      const positionOptions = {
        enableHighAccuracy: true, // Request high accuracy GPS data
        maximumAge: 0, // Don't use cached position data
        timeout: 10000, // Time to wait for position data (10 seconds)
      };

      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            console.log("Location accuracy:", accuracy, "meters");

            // Only accept positions with good accuracy (optional)
            if (accuracy > 100) {
              // 100 meters threshold, adjust as needed
              console.warn("Low accuracy location data:", accuracy, "meters");
            }

            setCurrentCoordinates([latitude, longitude]);
            resolve([latitude, longitude]);
          },
          (error) => {
            console.error("Error getting location:", error);
            if (error.code === error.PERMISSION_DENIED) {
              alert("Please allow location access to use this feature.");
            }
            reject([]);
          },
          positionOptions // Add the positioning options
        );
      });
    } catch (error) {
      console.error("Error checking location permission:", error);
      return [];
    }
  };

  useEffect(() => {
    // sendData();

    const interval = setInterval(() => {
      const storedData = localStorage.getItem("userObj");
      if (storedData) {
        console.log("Refreshing...");

        sendData();
        // window.location.reload();
      }
    }, 20000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      {console.log("userData", userData)}

      {!userData && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            style={{ flex: 1, marginRight: "10px" }} // Added margin for spacing
            onClick={() => setDialogPopup1(true)} // Added onClick to open the dialog
          >
            Looking for taxi
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            style={{ flex: 1 }} // Adjusted to take equal space
            onClick={() => setDialogPopup2(true)} // Added onClick to open the dialog
          >
            Looking for Passengers
          </Button>
        </div>
      )}
      {userData && (
        <div>
          <Card style={{ backgroundColor: "#f0f8ff", borderRadius: "8px" }}>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" style={{ color: "orange" }}>
                  Raid Information
                </Typography>
                <IconButton
                  style={{
                    color: "orange",
                    border: "2px solid green",
                    borderRadius: "5px",
                    marginRight: "3px",
                  }}
                  onClick={() => {
                    // alert("Page manually refreshed");
                    window.location.reload();
                    // fetchAllData();
                  }}
                  // aria-label="close"
                >
                  <span className="material-icons">refresh</span>
                </IconButton>
                <IconButton
                  style={{
                    color: "green",
                    border: "2px solid gray",
                    borderRadius: "5px",
                  }}
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to proceed?")) {
                      // confirm(); // Call the confirm function if user clicks "Yes"

                      const response = await axios.post(
                        baseURL + "/api/taxi/remove",
                        {
                          role: userData?.role,
                          mobile: userData?.mobile,
                        }
                      );
                      // console.log(
                      //   "Data removed successfully:",
                      //   response.data
                      // );
                      setUserData(null);
                      localStorage.removeItem("userObj");
                      toggleMap();
                    } else {
                    }
                  }}
                  // aria-label="close"
                >
                  <span className="material-icons">close</span>
                </IconButton>
              </div>
              {/*<Typography variant="h6" style={{ color: "blue" }}>
                Name: {userData.name} - {userData.mobile}
              </Typography>
              <Typography variant="h6" style={{ color: "green" }}>
                from : {userData.pickupLocation} to:{" "}
                {userData.dropLocation}{" "}
              </Typography>*/}
            </CardContent>
          </Card>
        </div>
      )}
      <Dialog open={dialogPopup1} onClose={() => setDialogPopup1(false)}>
        <DialogTitle>Enter Your Details</DialogTitle>
        <DialogContent>
          <TextField
            size="small"
            autoFocus
            margin="dense"
            label="Your Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!name && submitted}
            helperText={!name && submitted ? "Name is required" : ""}
          />
          <TextField
            size="small"
            margin="dense"
            label="Mobile Number"
            type="Number"
            fullWidth
            variant="outlined"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            error={(!mobile || !/^[0-9]{10}$/.test(mobile)) && submitted}
            helperText={
              !mobile && submitted
                ? "Mobile number is required"
                : !/^[0-9]{10}$/.test(mobile) && submitted
                ? "Mobile number must be 10 digits"
                : ""
            }
          />

          <div>
            <FormControl
              fullWidth
              margin="dense"
              error={!pickupLocation && submitted}
            >
              <InputLabel id="pickup-label">Pick Up Location</InputLabel>
              <Select
                labelId="pickup-label"
                value={pickupLocation}
                onChange={(e) => {
                  getCoordinates2();
                  setPickupLocation(e.target.value);
                }}
              >
                {stops.map((el, ind) => (
                  <MenuItem key={"to" + ind} value={el.name}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>

              {!pickupLocation && submitted && (
                <FormHelperText>Select your pick up location</FormHelperText>
              )}
            </FormControl>
            <FormControl
              fullWidth
              margin="dense"
              error={!dropLocation && submitted}
            >
              <InputLabel id="drop-label">Drop Location</InputLabel>
              <Select
                labelId="drop-label"
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
              >
                {stops.map((el, ind) => (
                  <MenuItem key={"from" + ind} value={el.name}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>
              {!dropLocation && submitted && (
                <FormHelperText>Select your drop location</FormHelperText>
              )}
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setName("");
              setMobile("");
              setDialogPopup1(false);
              setSubmitted(false);
              setPickupLocation("");
              setDropLocation("");
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              const mobilePattern = /^[0-9]{10}$/;
              setSubmitted(true);
              if (
                name &&
                mobile &&
                mobilePattern.test(mobile) &&
                pickupLocation &&
                dropLocation
              ) {
                getCoordinates2();

                try {
                  const response = await axios.post(
                    baseURL + "/api/taxi/add-passenger",
                    {
                      name,
                      mobile,
                      from: pickupLocation,
                      to: dropLocation,
                      location: currentCoordinates,
                    }
                  );
                  // console.log("Data saved successfully:", response.data);
                  await setAllData(response.data.data);

                  await mapFunc(response.data.data, currentCoordinates);
                } catch (error) {
                  console.error("Error saving data:", error);
                }

                // Set values in local storage
                localStorage.setItem(
                  "userObj",
                  JSON.stringify({
                    name,
                    mobile,
                    pickupLocation,
                    dropLocation,
                    currentCoordinates,
                    role: "passenger",
                  })
                );
                setUserData({
                  name,
                  mobile,
                  pickupLocation,
                  dropLocation,
                  currentCoordinates,
                  role: "passenger",
                });
                toggleMap();
                setDialogPopup1(false);
                window.location.reload();
              } else {
                console.log("Some fields are missing");
              }
            }}
            color="primary"
          >
            Continue pa
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialogPopup2} onClose={() => setDialogPopup2(false)}>
        <DialogTitle>Enter Your Details</DialogTitle>
        <DialogContent>
          <TextField
            size="small"
            autoFocus
            margin="dense"
            label="Your Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!name && submitted}
            helperText={!name && submitted ? "Name is required" : ""}
          />
          <TextField
            size="small"
            margin="dense"
            label="Mobile Number"
            type="Number"
            fullWidth
            variant="outlined"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            error={(!mobile || !/^[0-9]{10}$/.test(mobile)) && submitted}
            helperText={
              !mobile && submitted
                ? "Mobile number is required"
                : !/^[0-9]{10}$/.test(mobile) && submitted
                ? "Mobile number must be 10 digits"
                : ""
            }
          />

          <TextField
            size="small"
            margin="dense"
            label="Enter Vehicle Number"
            type="Text"
            fullWidth
            // variant="standard"
            // variant="filled"
            variant="outlined"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            error={!vehicleNumber && submitted}
            helperText={
              !vehicleNumber && submitted ? "Vehicle Number is required" : ""
            }
          />
          <TextField
            size="small"
            margin="dense"
            label="Seats available"
            type="Number"
            fullWidth
            // variant="standard"
            // variant="filled"
            variant="outlined"
            value={availableSeats}
            onChange={(e) => setAvailableSeats(e.target.value)}
            error={availableSeats < 1 && submitted}
            helperText={
              availableSeats < 1 && submitted ? "Seats available atleast 1" : ""
            }
          />

          <div>
            <FormControl
              fullWidth
              margin="dense"
              error={!pickupLocation && submitted}
            >
              <InputLabel id="pickup-label">Pick Up Location</InputLabel>
              <Select
                labelId="pickup-label"
                value={pickupLocation}
                onChange={(e) => {
                  getCoordinates2();
                  setPickupLocation(e.target.value);
                }}
              >
                {stops.map((el, ind) => (
                  <MenuItem key={"to" + ind} value={el.name}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>
              {!pickupLocation && submitted && (
                <FormHelperText>Select your pick up location</FormHelperText>
              )}
            </FormControl>
            <FormControl
              fullWidth
              margin="dense"
              error={!dropLocation && submitted}
            >
              <InputLabel id="drop-label">Drop Location</InputLabel>
              <Select
                labelId="drop-label"
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
              >
                {stops.map((el, ind) => (
                  <MenuItem key={"from" + ind} value={el.name}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>
              {!dropLocation && submitted && (
                <FormHelperText>Select your drop location</FormHelperText>
              )}
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setName("");
              setMobile("");
              setDialogPopup1(false);
              setVehicleNumber("");
              setDialogPopup2(false);
              setSubmitted(false);
              setPickupLocation("");
              setDropLocation("");
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              const mobilePattern = /^[0-9]{10}$/;
              setSubmitted(true);
              if (
                name &&
                mobile &&
                mobilePattern.test(mobile) &&
                pickupLocation &&
                dropLocation
              ) {
                getCoordinates2();

                try {
                  const response = await axios.post(
                    baseURL + "/api/taxi/add-taxi",
                    {
                      name,
                      mobile,
                      from: pickupLocation,
                      to: dropLocation,
                      location: currentCoordinates,
                    }
                  );
                  // console.log("Data saved successfully:", response.data);
                  await setAllData(response.data.data);

                  await mapFunc(response.data.data, currentCoordinates);
                } catch (error) {
                  console.error("Error saving data:", error);
                }

                // Set values in local storage
                localStorage.setItem(
                  "userObj",
                  JSON.stringify({
                    name,
                    mobile,
                    pickupLocation,
                    dropLocation,
                    currentCoordinates,
                    role: "taxi",
                    // a,
                  })
                );
                setUserData({
                  name,
                  mobile,
                  pickupLocation,
                  dropLocation,
                  currentCoordinates,
                  role: "taxi",
                  // a,
                });
                toggleMap();
                setDialogPopup2(false);
                window.location.reload();
              } else {
                console.log("Some fields are missing");
              }
            }}
            color="primary"
          >
            Continue taxi
          </Button>
        </DialogActions>
      </Dialog>
      {/* Display allData */}
      {userData && (
        <div>
          <Accordion key={1}>
            <AccordionSummary>
              <Typography>All Data List ( {allData.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allData.map((vehicle, index) => (
                <li key={index}>
                  {vehicle.name} - {vehicle.role} - {vehicle.mobile}
                </li>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </div>
  );
};
export default App;
