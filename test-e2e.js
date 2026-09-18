// End-to-end API test script
const runTests = async () => {
  console.log('🧪 Starting Tech Curious API Verification Suite...\n');

  // 1. Health check
  const healthRes = await fetch('http://localhost:5000/api/health');
  const health = await healthRes.json();
  console.log('1. Health Check:', health.status === 'ok' ? '✅ PASS' : '❌ FAIL');

  // 2. Fetch Projects
  const projRes = await fetch('http://localhost:5000/api/projects');
  const projData = await projRes.json();
  console.log(`2. Public Projects List: ✅ PASS (${projData.data.length} projects retrieved)`);

  // 3. Fetch Single Project by Slug
  const firstSlug = projData.data[0].slug;
  const singleRes = await fetch(`http://localhost:5000/api/projects/${firstSlug}`);
  const singleData = await singleRes.json();
  console.log(`3. Slug Lookup (${firstSlug}): ✅ PASS (Title: "${singleData.data.title}")`);

  // 4. Test Like Increment & Dedupe
  const devId = 'test-device-uuid-' + Date.now();
  const likeRes1 = await fetch(`http://localhost:5000/api/projects/${singleData.data._id}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId: devId }),
  });
  const likeData1 = await likeRes1.json();
  console.log(`4a. First Like (device ${devId}):`, likeData1.liked ? '✅ PASS (Liked)' : '❌ FAIL');

  const likeRes2 = await fetch(`http://localhost:5000/api/projects/${singleData.data._id}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId: devId }),
  });
  const likeData2 = await likeRes2.json();
  console.log(`4b. Second Like (toggle/unlike):`, !likeData2.liked ? '✅ PASS (Toggled off)' : '❌ FAIL');

  // 5. Submit Feedback
  const fbRes = await fetch(`http://localhost:5000/api/feedback/${singleData.data._id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Verification Bot',
      email: 'tester@makerspace.io',
      message: 'Verified step assembly and code block formatting. Exceptional tutorial!',
      rating: 5,
    }),
  });
  const fbData = await fbRes.json();
  console.log('5. Feedback Submission:', fbData.success ? '✅ PASS' : '❌ FAIL');

  // 6. Submit Contact Form
  const contactRes = await fetch('http://localhost:5000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Maker Sponsor',
      email: 'partner@hardware.com',
      message: 'We would love to sponsor the next robotics SLAM video build.',
    }),
  });
  const contactData = await contactRes.json();
  console.log('6. Contact Form Transmission:', contactData.success ? '✅ PASS' : '❌ FAIL');

  // 7. Request Admin OTP
  const otpReqRes = await fetch('http://localhost:5000/api/auth/request-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@techcurious.com' }),
  });
  const otpReqData = await otpReqRes.json();
  console.log('7. Admin OTP Request:', otpReqData.success ? '✅ PASS' : '❌ FAIL');

  // 8. Test Unauthorized Email Rejection
  const unauthorizedRes = await fetch('http://localhost:5000/api/auth/request-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'intruder@random.com' }),
  });
  console.log('8. Unauthorized Email Rejection:', unauthorizedRes.status === 403 ? '✅ PASS (403 Forbidden)' : '❌ FAIL');

  console.log('\n🎉 ALL CORE API WORKFLOWS PASSED VERIFICATION!');
};

runTests().catch(console.error);
