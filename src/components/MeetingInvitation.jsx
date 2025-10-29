import { useState } from 'react';
import { HeartSVG, RomanticCameraSVG, SparkleSVG, RingSVG } from './RomanticSVGs';

export default function MeetingInvitation() {
  const [showInvitationForm, setShowInvitationForm] = useState(false);
  const [invitations, setInvitations] = useState([
    {
      id: 1,
      title: 'Movie Night - The Notebook',
      date: '2024-01-15',
      time: '8:00 PM',
      type: 'movie_night',
      meetLink: 'https://meet.google.com/abc-123-def',
      status: 'pending',
      message: 'Let\'s watch our favorite romantic movie together! I\'ll make popcorn and we can cozy up on the couch.'
    },
    {
      id: 2,
      title: 'Virtual Date Night',
      date: '2024-01-20',
      time: '7:30 PM',
      type: 'virtual_date',
      meetLink: 'https://meet.google.com/xyz-789-uvw',
      status: 'accepted',
      message: 'Dress up fancy for our virtual date! I have something special planned.'
    }
  ]);
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    type: 'virtual_date',
    message: '',
    meetLink: ''
  });

  const handleCreateInvitation = (e) => {
    e.preventDefault();
    const newInvitation = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      meetLink: `https://meet.google.com/${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`
    };
    setInvitations([newInvitation, ...invitations]);
    setFormData({
      title: '',
      date: '',
      time: '',
      type: 'virtual_date',
      message: '',
      meetLink: ''
    });
    setShowInvitationForm(false);
  };

  const handleAcceptInvitation = (id) => {
    setInvitations(invitations.map(inv =>
      inv.id === id ? { ...inv, status: 'accepted' } : inv
    ));
  };

  const handleDeclineInvitation = (id) => {
    setInvitations(invitations.map(inv =>
      inv.id === id ? { ...inv, status: 'declined' } : inv
    ));
  };

  const copyMeetLink = (link) => {
    navigator.clipboard.writeText(link);
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'copy-notification modern-notification';
    notification.textContent = 'Meeting link copied to clipboard';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  const getInvitationIcon = (type) => {
    switch (type) {
      case 'movie_night':
        return <RomanticCameraSVG size={20} color="#ff69b4" />;
      case 'virtual_date':
        return <HeartSVG size={20} color="#ff1493" />;
      case 'concert':
        return <SparkleSVG size={20} color="#ffd700" />;
      default:
        return <RingSVG size={20} color="#ffd700" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return '#6bcf7f';
      case 'declined':
        return '#ff6b6b';
      default:
        return '#ffd93d';
    }
  };

  return (
    <div className="modern-invitations-page">
      <div className="page-header">
        <h1>Virtual Meeting Invitations</h1>
        <p>Send and manage virtual meeting invitations</p>
        <button
          className="primary-button"
          onClick={() => setShowInvitationForm(true)}
        >
          Create New Invitation
        </button>
      </div>

      <div className="invitations-grid">
        {invitations.map(invitation => (
          <div key={invitation.id} className="invitation-card">
            <div className="card-header">
              <div className="invitation-type">
                {getInvitationIcon(invitation.type)}
              </div>
              <div className="invitation-status">
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(invitation.status) }}
                >
                  {invitation.status}
                </span>
              </div>
            </div>
           
            <div className="card-content">
              <h3>{invitation.title}</h3>
              <div className="invitation-details">
                <p className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{invitation.date} at {invitation.time}</span>
                </p>
                <p className="detail-item">
                  <span className="detail-label">Message:</span>
                  <span className="detail-value">{invitation.message}</span>
                </p>
              </div>
            </div>

            <div className="card-actions">
              <div className="meet-link-section">
                <button
                  className="secondary-button"
                  onClick={() => copyMeetLink(invitation.meetLink)}
                  title="Copy Google Meet link"
                >
                  Copy Meet Link
                </button>
                <span className="meet-link-preview">
                  {invitation.meetLink.substring(0, 30)}...
                </span>
              </div>
              
              {invitation.status === 'pending' && (
                <div className="action-buttons">
                  <button
                    className="accept-button"
                    onClick={() => handleAcceptInvitation(invitation.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="decline-button"
                    onClick={() => handleDeclineInvitation(invitation.id)}
                  >
                    Decline
                  </button>
                </div>
              )}
              
              {invitation.status === 'accepted' && (
                <div className="status-message accepted">
                  Accepted! See you there!
                </div>
              )}
              
              {invitation.status === 'declined' && (
                <div className="status-message declined">
                  Maybe next time!
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showInvitationForm && (
        <div className="modal-overlay">
          <div className="modal-form">
            <div className="modal-header">
              <h3>Create Virtual Invitation</h3>
              <button
                className="close-button"
                onClick={() => setShowInvitationForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateInvitation}>
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Movie Night, Virtual Date"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Event Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="virtual_date">Virtual Date</option>
                  <option value="movie_night">Movie Night</option>
                  <option value="concert">Virtual Concert</option>
                  <option value="game_night">Game Night</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Write a message to invite your partner..."
                  rows="4"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="primary-button">
                  Create Invitation
                </button>
                <button type="button" className="secondary-button" onClick={() => setShowInvitationForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}