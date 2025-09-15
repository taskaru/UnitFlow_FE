import { ref, computed } from 'vue';

export function useReportLogic() {
  // 例えのデータ
  const reports = ref([
    {
      id: 1,
      name: 'ジャンジェヨン_c_generail',
      unit: 'PD',
      src: '写真ソース',
      title: '【日報提出】 8/25 (金) 9:00-20:00',
      description:
        '누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!',
      createdAt: '2025-09-15T00:00:00.000Z',
    },
    {
      id: 2,
      name: 'ジャンジェヨン_c_generail',
      unit: 'PDM',
      src: '写真ソース',
      title: '【日報提出】 8/25 (金) 9:00-20:00',
      description: '内容2',
      createdAt: '2025-09-15T00:00:00.000Z',
    },
    {
      id: 3,
      name: 'ジャンジェヨン_c_generail',
      unit: 'CI',
      src: '写真ソース',
      title: '【日報提出】 8/25 (金) 9:00-20:00',
      description: '内容3',
      createdAt: '2025-09-15T00:00:00.000Z',
    },
    {
      id: 4,
      name: 'ジャンジェヨン_c_generail',
      unit: 'HR',
      src: '写真ソース',
      title: '【日報提出】 8/25 (金) 9:00-20:00',
      description: '内容4',
      createdAt: '2025-09-15T00:00:00.000Z',
    },
  ]);

  // ミドル/バックtodo
  const dataSource = computed(() => {
    return reports.value.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      name: r.name,
      unit: r.unit,
      createdAt: r.createdAt,
    }));
  });

  return {
    dataSource,
  };
}
