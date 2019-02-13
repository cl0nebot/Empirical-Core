class activitySessionInteraction {
  constructor(activitySessionUID) {
    this.activitySessionUID = activitySessionUID;
    this.baseUrl = process.env.EMPIRICAL_BASE_URL;
  }

  sendActivitySessionInteractionLog(data = {}) {
    // 
    if (this.activitySessionUID === 'null' || this.activitySessionUID == null) {
      return null;
    }
    const url = `${this.baseUrl}/api/v1/activity_sessions/${this.activitySessionUID}/activity_session_interaction_logs`;
    return fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({ meta: data, }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }
}

const serviceInstances = {};

function getActivitySessionInteractionService(activitySessionUID) {
  if (!serviceInstances[activitySessionUID]) {
    serviceInstances[activitySessionUID] = new activitySessionInteraction(activitySessionUID);
  }
  return serviceInstances[activitySessionUID];
}

exports.getActivitySessionInteractionService = getActivitySessionInteractionService;
