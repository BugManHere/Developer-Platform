const express = require('express');
const router = express.Router();
// 登录token
import { getOutput } from '../api/index';

router.get('/config', async function(req, res) {
  const { output } = await getOutput(req.query);
  res.json(output);
});

module.exports = router;
