import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 에러 페이지로 리다이렉트된 경우 메인 페이지로 리다이렉트
  return NextResponse.redirect(new URL('/', request.url));
}
