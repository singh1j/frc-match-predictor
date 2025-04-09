async function fetchLatestEvent(team) {
    try {
      const response = await fetch('https://www.thebluealliance.com/api/v3/team/' + team + '/events', {
        headers: {
          'X-TBA-Auth-Key': 'kGqIqjkNicZ2tUgS63Vn6FPJiCTOggYvrLMGMYaXR9hNkAALBf5GgTVwiL9pfm7L'
        }
      });
  
      const events = await response.json();
  
      // Sort events by start_date, descending (most recent first)
      const sortedEvents = events.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
  
      // Get the latest event (first in the sorted array)
      const latestEvent = sortedEvents[1];  // Fixed to [0] to get the most recent event
  
      if (latestEvent) {
        // Construct the full event key (e.g., 2025_mrcmp)
        const eventKey = latestEvent.year + latestEvent.event_code;  // Corrected the format
        return eventKey;  // Return the full event key
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }
  async function fetchLatestEvent(team) {
    try {
      const response = await fetch('https://www.thebluealliance.com/api/v3/team/' + team + '/events', {
        headers: {
          'X-TBA-Auth-Key': 'kGqIqjkNicZ2tUgS63Vn6FPJiCTOggYvrLMGMYaXR9hNkAALBf5GgTVwiL9pfm7L'
        }
      });
  
      const events = await response.json();
  
      // Sort events by start_date, descending (most recent first)
      const sortedEvents = events.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
  
      // Get the latest event (first in the sorted array)
      const latestEvent = sortedEvents[1];  // Fixed to [0] to get the most recent event
  
      if (latestEvent) {
        // Construct the full event key (e.g., 2025_mrcmp)
        const eventKey = latestEvent.year + latestEvent.event_code;  // Corrected the format
        return eventKey;  // Return the full event key
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }
  
  async function fetchOPRForEvent(team) {
    try {
      // Get the latest event key
      const eventKey = await fetchLatestEvent(team);
      if (!eventKey) {
        console.error('Invalid event key, cannot fetch OPR.');
        return;
      }
  
      // Now fetch the OPR for the event using the full event key
      const oprResponse = await fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/oprs`, {
        headers: {
          'X-TBA-Auth-Key': 'kGqIqjkNicZ2tUgS63Vn6FPJiCTOggYvrLMGMYaXR9hNkAALBf5GgTVwiL9pfm7L'
        }
      });
  
      const oprData = await oprResponse.json();
  
      // Extract the OPR for the specific team (e.g., frc1391)
      const teamOPR = oprData.oprs[team];
      if (teamOPR) {
        return teamOPR;  // Return the OPR value
      } else {
        console.log(`No OPR found for Team ${team} at event ${eventKey}.`);
      }
    } catch (error) {
      console.error('Error fetching OPR:', error);
    }
  }
  async function fetchTeamName(team) {
    try {
      // Get the latest event key
  
      // Now fetch the OPR for the event using the full event key
      const response = await fetch(`https://www.thebluealliance.com/api/v3/team/`+team, {
        headers: {
          'X-TBA-Auth-Key': 'kGqIqjkNicZ2tUgS63Vn6FPJiCTOggYvrLMGMYaXR9hNkAALBf5GgTVwiL9pfm7L'
        }
      });
  
      const data = await response.json();
  
      // Extract the OPR for the specific team (e.g., frc1391)
      return data.nickname;
  }
  catch {
    console.log("N Bin")
  }
}
  var inputs = document.getElementsByTagName('input');
  var redScore = 0;
  var blueScore = 0;
  
  async function clicked() {
    // Create arrays to store the OPR promises
    document.getElementsByTagName('h1')[0].innerHTML = "calculating..."
    const redTeamPromises = [];
    const blueTeamPromises = [];
  
    // Check if all inputs are filled
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value === "") {
        alert("Input All Team Numbers");
        return;  // Exit if any input is empty
      } else {
        // Prepare the promises for each team's OPR
        document.getElementById((i+1)).innerHTML = await fetchTeamName('frc'+inputs[i].value)
        if (i < 3) {
          redTeamPromises.push(fetchOPRForEvent('frc' + inputs[i].value));
        } else {
          blueTeamPromises.push(fetchOPRForEvent('frc' + inputs[i].value));
        }
      }
    }
  
    try {
      // Wait for all the promises to resolve
      const redOPRs = await Promise.all(redTeamPromises);
      const blueOPRs = await Promise.all(blueTeamPromises);
      console.log(redOPRs)
      console.log(blueOPRs)
      // Now sum the OPRs for red and blue teams
      redScore = redOPRs.reduce((total, opr) => {
        // Ensure the opr is a valid number, otherwise treat it as 0
        return total + (typeof opr === 'number' ? opr : 0);
      }, 0);
      
      blueScore = blueOPRs.reduce((total, opr) => {
        // Ensure the opr is a valid number, otherwise treat it as 0
        return total + (typeof opr === 'number' ? opr : 0);
      }, 0);
      document.getElementsByTagName('h1')[0].innerHTML = Math.round(redScore) + " - " + Math.round(blueScore)
      document.getElementsByTagName('h1')[0].style.color = redScore > blueScore ? 'rgb(255, 135, 135)' : 'rgb(135, 181, 255)'

      // Output the scores
    } catch (error) {
      console.error("Error fetching OPRs:", error);
    }
  }