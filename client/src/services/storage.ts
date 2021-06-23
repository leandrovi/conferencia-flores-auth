export function saveLoggedAttendee() {
  localStorage.setItem("@conferenciaflores:logged", JSON.stringify(true));
}

export function loadLoggedAttendee(): boolean {
  const result = localStorage.getItem("@conferenciaflores:logged");

  if (!result) {
    return false;
  }

  return JSON.parse(result);
}
