export default (lastLaunched, days = 3) => (
  lastLaunched > new Date(
    (new Date().getTime()) - (days * 24 * 60 * 60 * 1000)
  )
);
