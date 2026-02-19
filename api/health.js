/**
 * GET /api/health - 서버 상태 확인
 */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ status: 'ok', message: 'Server is running' });
}
