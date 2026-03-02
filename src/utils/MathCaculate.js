/**
 * Hàm tính toán tỷ lệ % so khớp giữa User và Job
 * @param {Array} userCompletedNodeIds - Mảng ID các node sinh viên đã hoàn thành
 * @param {Array} jobRequirements - Mảng các đối tượng yêu cầu { nodeId, weight }
 * @returns {number}
 */
export const calculateMatchingScore = (userCompletedNodeIds, jobRequirements) => {
  if (!jobRequirements || jobRequirements.length === 0) return 0;

  // 1. Tính tổng trọng số yêu cầu của Job
  const totalWeight = jobRequirements.reduce((sum, req) => sum + (req.weight || 1), 0);

  // 2. Tính tổng trọng số mà sinh viên đã đạt được
  const earnedWeight = jobRequirements.reduce((sum, req) => {
    if (userCompletedNodeIds.includes(req.nodeId)) {
      return sum + (req.weight || 1);
    }
    return sum;
  }, 0);

  // 3. Tính phần trăm và làm tròn 1 chữ số thập phân
  const score = (earnedWeight / totalWeight) * 100;
  return Math.round(score * 10) / 10;
};

/**
 * Hàm lọc danh sách công việc dựa trên tỷ lệ so khớp tối thiểu
 */
export const filterJobsByMatching = (jobs, userSkills, minRate = 50) => {
  return jobs.map(job => ({
    ...job,
    matchRate: calculateMatchingScore(userSkills, job.requirements)
  })).filter(job => job.matchRate >= minRate)
     .sort((a, b) => b.matchRate - a.matchRate); // Ưu tiên Job khớp cao nhất lên đầu
};