import nextConnect from "next-connect";

export default nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  },
});
