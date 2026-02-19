/**
 * POST /api/analyze - 음식 이미지 분석
 * Express 앱으로 요청 전달 (multipart/form-data 지원)
 */
import app from '../backend/server.js';

export default function handler(req, res) {
  return app(req, res);
}
