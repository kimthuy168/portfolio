'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import useSWR from 'swr'

const data = [
  { name: 'Projects', value: 12 },
  { name: 'Skills', value: 24 },
  { name: 'Experience', value: 3 },
  { name: 'Messages', value: 8 },
]

type DataResponse = {
  totalProjects: number
  totalSkills: number
  totalExperience: number
  totalMessages: number
}

interface DataProps {
  chartData: DataResponse;
  isLoading: boolean;
  error: any;
}

export function DashboardChart({ chartData, isLoading, error }:  DataProps) {

     const transformedData = data
    ? [
        { name: 'Projects', value: chartData?.totalProjects },
        { name: 'Skills', value: chartData?.totalSkills },
        { name: 'Experience', value: chartData?.totalExperience },
        { name: 'Messages', value: chartData?.totalMessages },
      ]
    : []
     const hasData = transformedData.some(item => typeof item.value === 'number' && item.value > 0)

    return (
     <div className="w-full h-[300px] bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Portfolio Chart</h2>

      {isLoading ? (
        <div className="h-full flex items-center justify-center text-gray-500">
          Loading chart...
        </div>
      ) : error ? (
        <div className="h-full flex items-center justify-center text-red-500">
          Failed to load chart data.
        </div>
      ) : !hasData ? (
        <div className="h-full flex items-center justify-center text-gray-500">
          No data available to display.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
