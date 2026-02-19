/**
 * Calculates depth score for a post
 *
 * @param {Object} options
 * @param {number} options.commentsCount
 * @param {number} options.avgReplyDepth
 * @param {number} options.uniqueParticipants
 * @param {number} options.avgCommentLength
 * @param {number} options.timeDecayFactor (0-1)
 *
 * @returns {number}
 */

export const calculateDepthScore = ({
  commentsCount = 0,
  avgReplyDepth = 0,
  uniqueParticipants = 0,
  avgCommentLength = 0,
  timeDecayFactor = 1,
}) => {
  const commentWeight = 2;
  const depthWeight = 5;
  const participantWeight = 3;
  const lengthWeight = 0.05;

  const baseScore =
    commentsCount * commentWeight +
    avgReplyDepth * depthWeight +
    uniqueParticipants * participantWeight +
    avgCommentLength * lengthWeight;

  return Number((baseScore * timeDecayFactor).toFixed(2));
};
