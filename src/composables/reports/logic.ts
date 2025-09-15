import { ref, computed } from 'vue';
import commonImage from '@/assets/icons/index.ts';

export function useReportLogic() {
  // 例えのデータ
  const reports = ref([
    {
      id: 1,
      name: 'ジャンジェヨン_c_generail',
      unit: 'PD',
      profileIcon: commonImage.google,
      likeData: {
        src: commonImage.like,
        likeCount: 12,
      },
      replyData: {
        src: commonImage.reply,
        replyCount: 3,
      },
      title: '【日報提出】 8/25 (金) 9:00-20:00',
      description:
        '누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!누나는 세계최고 미인 알겠느냐 우민들아!',
      createdAt: '2025-09-15T00:00:00.000Z',
    },
    {
      id: 2,
      name: 'ジャンジェヨン_c_generail',
      unit: 'PDM',
      profileIcon: commonImage.google,
      likeData: {
        src: commonImage.like,
        likeCount: 12,
      },
      replyData: {
        src: commonImage.reply,
        replyCount: 3,
      },
      title: '【日報提出】 8/25 (金) 9:00-20:00',
      description: '内容2',
      createdAt: '2025-09-15T00:00:00.000Z',
    },
    {
      id: 3,
      name: 'ジャンジェヨン_c_generail',
      unit: 'CI',
      profileIcon: commonImage.google,
      likeData: {
        src: commonImage.like,
        likeCount: 12,
      },
      replyData: {
        src: commonImage.reply,
        replyCount: 3,
      },
      title: '【日報提出】 8/25 (金) 9:00-20:00',
      description: '内容3',
      createdAt: '2025-09-15T00:00:00.000Z',
    },
    {
      id: 4,
      name: 'ジャンジェヨン_c_generail',
      unit: 'HR',
      profileIcon: commonImage.google,
      likeData: {
        src: commonImage.like,
        likeCount: 12,
      },
      replyData: {
        src: commonImage.reply,
        replyCount: 3,
      },
      title: '【日報提出】 8/25 (金) 9:00-20:00',
      description: '内容4',
      createdAt: '2025-09-15T00:00:00.000Z',
    },
  ]);

  /**
   * バックエンドからもらったデータの加工処理
   */
  const dataSource = computed(() => {
    return reports.value.map(r => {
      const formattedDate = new Date(r.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      return {
        id: r.id,
        title: r.title,
        description: r.description,
        name: r.name,
        unit: r.unit,
        createdAt: formattedDate,
        profileIcon: r.profileIcon,
        likeData: r.likeData,
        replyData: r.replyData,
      };
    });
  });

  return {
    dataSource,
  };
}
