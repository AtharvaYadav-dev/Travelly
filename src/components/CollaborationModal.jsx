import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Mail, Check, Trash2, Crown, Users, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '../supabase';

const CollaborationModal = ({ tripId, tripData, currentUser, onClose }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [votes, setVotes] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    loadCollaborators();
    loadComments();
    loadVotes();
    setupRealtimeSubscription();
  }, [tripId]);

  const setupRealtimeSubscription = () => {
    // Subscribe to real-time changes
    const channel = supabase
      .channel(`trip:${tripId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'trip_collaborators', filter: `trip_id=eq.${tripId}` },
        () => loadCollaborators()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'trip_comments', filter: `trip_id=eq.${tripId}` },
        () => loadComments()
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineUsers(Object.values(state).flat());
      })
      .subscribe();

    // Track own presence
    channel.track({
      user_id: currentUser.id,
      email: currentUser.email,
      online_at: new Date().toISOString()
    });

    return () => {
      channel.unsubscribe();
    };
  };

  const loadCollaborators = async () => {
    try {
      const { data, error } = await supabase
        .from('trip_collaborators')
        .select('*')
        .eq('trip_id', tripId);

      if (!error && data) {
        setCollaborators(data);
      }
    } catch (error) {
      console.error('Load collaborators error:', error);
      // Use mock data for demo
      setCollaborators([
        { id: 1, email: currentUser.email, role: 'owner', status: 'accepted' }
      ]);
    }
  };

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('trip_comments')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setComments(data);
      }
    } catch (error) {
      console.error('Load comments error:', error);
      setComments([]);
    }
  };

  const loadVotes = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_votes')
        .select('*')
        .eq('trip_id', tripId);

      if (!error && data) {
        const voteMap = {};
        data.forEach(vote => {
          if (!voteMap[vote.activity_id]) {
            voteMap[vote.activity_id] = { up: 0, down: 0 };
          }
          if (vote.vote_type === 'up') voteMap[vote.activity_id].up++;
          else voteMap[vote.activity_id].down++;
        });
        setVotes(voteMap);
      }
    } catch (error) {
      console.error('Load votes error:', error);
      setVotes({});
    }
  };

  const inviteCollaborator = async () => {
    if (!inviteEmail.trim()) return;

    setInviting(true);
    try {
      const { data, error } = await supabase
        .from('trip_collaborators')
        .insert([{
          trip_id: tripId,
          email: inviteEmail.trim(),
          role: 'editor',
          status: 'pending',
          invited_by: currentUser.id
        }])
        .select()
        .single();

      if (!error) {
        // Send email invitation (you'd implement this with a backend function)
        await sendInviteEmail(inviteEmail, tripData);
        setInviteEmail('');
        loadCollaborators();
      }
    } catch (error) {
      console.error('Invite error:', error);
    } finally {
      setInviting(false);
    }
  };

  const sendInviteEmail = async (email, trip) => {
    // This would be implemented with a backend function or email service
    console.log(`Sending invite to ${email} for trip: ${trip.title}`);
    // For now, just log it
  };

  const removeCollaborator = async (collaboratorId) => {
    try {
      await supabase
        .from('trip_collaborators')
        .delete()
        .eq('id', collaboratorId);

      loadCollaborators();
    } catch (error) {
      console.error('Remove collaborator error:', error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      await supabase
        .from('trip_comments')
        .insert([{
          trip_id: tripId,
          user_id: currentUser.id,
          user_email: currentUser.email,
          comment: newComment.trim()
        }]);

      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Add comment error:', error);
    }
  };

  const voteOnActivity = async (activityId, voteType) => {
    try {
      await supabase
        .from('activity_votes')
        .upsert({
          trip_id: tripId,
          activity_id: activityId,
          user_id: currentUser.id,
          vote_type: voteType
        });

      loadVotes();
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="premium-glass max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-3xl border border-white/10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  Collaborate on Trip
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  Plan together with friends and family
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Online Users */}
          {onlineUsers.length > 0 && (
            <div className="flex items-center gap-2 bg-white/10 rounded-xl p-3">
              <div className="flex -space-x-2">
                {onlineUsers.slice(0, 5).map((user, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                ))}
              </div>
              <span className="text-sm text-white/80">
                {onlineUsers.length} online now
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Left Column - Collaborators */}
          <div>
            <h3 className="text-xl font-black text-white mb-4">Team Members</h3>

            {/* Invite Form */}
            <div className="premium-glass p-4 rounded-xl border border-white/10 mb-4">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-3">
                Invite Collaborator
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
                />
                <button
                  onClick={inviteCollaborator}
                  disabled={inviting || !inviteEmail.trim()}
                  className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/80 text-white font-bold transition-all disabled:opacity-50"
                >
                  {inviting ? '...' : <UserPlus className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Collaborators List */}
            <div className="space-y-3">
              {collaborators.map((collab) => (
                <div
                  key={collab.id}
                  className="premium-glass p-4 rounded-xl border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-white font-bold">
                      {collab.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-bold">{collab.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {collab.role === 'owner' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Owner
                          </span>
                        )}
                        {collab.role === 'editor' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                            Editor
                          </span>
                        )}
                        {collab.status === 'pending' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {collab.role !== 'owner' && (
                    <button
                      onClick={() => removeCollaborator(collab.id)}
                      className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Comments */}
          <div>
            <h3 className="text-xl font-black text-white mb-4">Discussion</h3>

            {/* Add Comment */}
            <div className="premium-glass p-4 rounded-xl border border-white/10 mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 resize-none"
              />
              <button
                onClick={addComment}
                disabled={!newComment.trim()}
                className="mt-2 px-6 py-2 rounded-lg bg-primary hover:bg-primary/80 text-white font-bold transition-all disabled:opacity-50"
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Comment
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No comments yet. Start the discussion!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="premium-glass p-4 rounded-xl border border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {comment.user_email?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-white">
                            {comment.user_email}
                          </p>
                          <span className="text-xs text-white/40">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-white/80">{comment.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900/50 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-full bg-primary hover:bg-primary/80 text-white font-bold uppercase tracking-wider transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CollaborationModal;
