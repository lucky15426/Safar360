
import React from 'react';
import GroupCard from '../components/SocialGroups/GroupCard';
// import { useMyGroups } from '../hooks/social/useMyGroups'; 

const MyGroupsPage = () => {
    // Mock data
    const myGroups = []; // fetch here

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">My Groups</h1>
            {myGroups.length === 0 ? (
                <p>You haven't joined any groups yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myGroups.map(g => <GroupCard key={g.id} group={g} />)}
                </div>
            )}
        </div>
    );
};

export default MyGroupsPage;
