const userProfileTracking = require("../models/users/userTrackingModel");
const { getDistanceFromLatLonInKm } = require("../utils/get_distance_between");

async function getNearestUsers(socket, data) {
  try {
    var coordinates = [parseFloat(data.lat), parseFloat(data.lng)];
    console.log("Received coordinates:", coordinates);

    const near = { type: "Point", coordinates: coordinates };

    const listOfUsersOnline = await userProfileTracking.find({
      is_online: true,
    });
    console.log("Number of online users:", listOfUsersOnline.length);

    const radiusInKm = 1.1;
    const listOfUsersWithinRadius = [];

    listOfUsersOnline.forEach((element) => {
      const carlng = element.location.coordinates[1];
      const carlat = element.location.coordinates[0];

      const dist = getDistanceFromLatLonInKm(
        coordinates[0],
        coordinates[1],
        carlat,
        carlng
      );

      if (dist <= radiusInKm) {
        listOfUsersWithinRadius.push(element);
      }
    });
    console.log(
      "Number of users within radius:",
      listOfUsersWithinRadius.length
    );

    socket.emit(
      "get_nearest_users",
      JSON.stringify({
        status: listOfUsersWithinRadius.length > 0 ? 200 : 404,
        message: "list of Users",
        result: listOfUsersWithinRadius,
      })
    );
    console.log("Sent nearest users to the client.");
  } catch (error) {
    console.error("Error:", error);
    socket.emit(
      "get_nearest_users",
      JSON.stringify({
        status: 500,
        message: "Internal Server Error",
      })
    );
  }
}

module.exports = getNearestUsers;
