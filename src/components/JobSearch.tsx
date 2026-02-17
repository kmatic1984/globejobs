import React, { useState } from 'react';

interface JobSearchProps {
    onSearch: (keyword: string, location: string) => void;
}

const JobSearch: React.FC<JobSearchProps> = ({ onSearch }) => {
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(keyword, location);
    };

    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Find Your Dream Job</h1>
                    <p className="text-blue-100 text-lg">Search millions of jobs worldwide</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Job Title or Keyword</label>
                            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. Software Engineer, Designer" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Location</label>
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. New York, Remote" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"> Search Jobs </button>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-gray-600 text-sm font-semibold">Popular searches:</span>
                        {['Remote Jobs', 'Full-time', 'Part-time', 'Startup'].map((tag) => (
                            <button key={tag} type="button" onClick={() => setKeyword(tag)} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"> {tag} </button>
                        ))}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobSearch;