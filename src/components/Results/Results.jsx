import React, { useState, useEffect } from "react";
import styles from './Results.module.css';
import resultImage from '../../assets/result.png';

// Эта функция преобразует XML в простой HTML
const cleanXmlContent = (xmlString) => {
    if (!xmlString) return '';
    
    let html = xmlString
      .replace(/<\?xml.*?\?>/, '')
      .replace(/<scandoc>|<\/scandoc>/g, '');
      
    return html.trim();
  };

// Эта функция обрабатывает контент любой структуры
const getSafeContent = (content) => {
    if (!content) return { safeText: 'Нет содержимого', safeMarkup: null };
    
    if (typeof content === 'string') {
      return { safeText: content, safeMarkup: null };
    }
    
    if (content.markup && typeof content.markup === 'string') {
      return { 
        safeText: content.text || 'Нет текстовой версии', 
        safeMarkup: cleanXmlContent(content.markup) 
      };
    }
    
    if (content.text && typeof content.text === 'string') {
      return { safeText: content.text, safeMarkup: null };
    }
    
    return { safeText: 'Неизвестный формат содержимого', safeMarkup: null };
  };

const Results = ({ searchData }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [histograms, setHistograms] = useState([]);
    const [publications, setPublications] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);

    const scrollLeft = () => {
        const carousel = document.querySelector(`.${styles.histogramCarousel}`);
        carousel.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        const carousel = document.querySelector(`.${styles.histogramCarousel}`);
        carousel.scrollBy({ left: 300, behavior: 'smooth' });
    };

    const loadMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Запрос гистограмм
                const histogramsResponse = await fetch('https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    body: JSON.stringify({
                        issueDateInterval: {
                            startDate: searchData.startDate,
                            endDate: searchData.endDate,
                        },
                        searchContext: {
                            targetSearchEntitiesContext: {
                                targetSearchEntities: [{
                                    type: "company",
                                    inn: searchData.inn,
                                    maxFullness: searchData.maxFullness,
                                }],
                                onlyMainRole: searchData.onlyMainRole,
                                tonality: searchData.tonality,
                                onlyWithRiskFactors: searchData.onlyWithRiskFactors,
                            },
                        },
                        limit: searchData.limit,
                        intervalType: "month",
                        histogramTypes: ["totalDocuments", "riskFactors"],
                    }),
                });

                if (!histogramsResponse.ok) {
                    throw new Error(`HTTP error! status: ${histogramsResponse.status}`);
                }

                const histogramsData = await histogramsResponse.json();
                setHistograms(histogramsData.data || []);

                // 2. Запрос списка публикаций
                const publicationsResponse = await fetch('https://gateway.scan-interfax.ru/api/v1/objectsearch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    body: JSON.stringify({
                        issueDateInterval: {
                            startDate: searchData.startDate,
                            endDate: searchData.endDate,
                        },
                        searchContext: {
                            targetSearchEntitiesContext: {
                                targetSearchEntities: [{
                                    type: "company",
                                    inn: searchData.inn,
                                    maxFullness: searchData.maxFullness,
                                }],
                                onlyMainRole: searchData.onlyMainRole,
                                tonality: searchData.tonality,
                                onlyWithRiskFactors: searchData.onlyWithRiskFactors,
                            },
                        },
                        limit: searchData.limit,
                    }),
                });

                if (!publicationsResponse.ok) {
                    throw new Error(`HTTP error! status: ${publicationsResponse.status}`);
                }

                const publicationsData = await publicationsResponse.json();
                const publicationIds = (publicationsData.items || []).map(item => item.encodedId);

                if (publicationIds.length === 0) {
                    setPublications([]);
                    return;
                }

                // 3. Запрос содержимого документов 
                const documentsResponse = await fetch('https://gateway.scan-interfax.ru/api/v1/documents', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    body: JSON.stringify({ ids: publicationIds.slice(0, 100) }), 
                });

                if (!documentsResponse.ok) {
                    throw new Error(`HTTP error! status: ${documentsResponse.status}`);
                }

                const documentsData = await documentsResponse.json();
                const validDocuments = documentsData
                    .filter(doc => doc.ok?.content)
                    .map(doc => ({
                        ...doc.ok,
                        content: typeof doc.ok.content === 'string'
                            ? { text: doc.ok.content }
                            : doc.ok.content        
                    }));
                setPublications(validDocuments);
                
            } catch (err) {
                console.error("Ошибка при загрузке данных:", err);
                setError("Ошибка загрузки данных. Пожалуйста, проверьте параметры поиска и попробуйте позже.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchData]);

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
                <p>Загрузка данных...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    // Для отладки - посмотрим первые 2 публикации
    console.log('Пример данных публикаций:', {
    first: publications[0]?.content,
    second: publications[1]?.content
    });
    return (
        <div className={styles.results}>
            <div className={styles.resultsHeader}>
                <div className={styles.resultsText}>
                    <h1 className={styles.resultsTitle}>Ищем. Скоро будут результаты</h1>
                    <p className={styles.resultsSubtitle}>
                        Поиск может занять некоторое время, просим сохранять терпение.
                    </p>
                </div>
                <img 
                    src={resultImage} 
                    alt="Результаты поиска" 
                    className={styles.resultsImage}
                />
            </div>

            <div className={styles.summarySection}>
                <div className={styles.summaryHeader}>
                    <div className={styles.summaryHeaderContent}>
                        <h2 className={styles.summaryTitle}>Общая сводка</h2>
                        <div className={styles.summaryCount}>
                            Найдено {histograms.reduce((acc, curr) => acc + (curr.data?.length || 0), 0)} вариантов
                        </div>
                    </div>
                </div>

                <div className={styles.histogramWrapper}>
                    <button onClick={scrollLeft} className={styles.scrollButton} aria-label="Прокрутить влево">
                        &lt;
                    </button>
                
                    <div className={styles.histogramCarousel}>
                        <div className={styles.histogramTable}>
                            <div className={styles.histogramRow}>
                                <div className={`${styles.histogramCell} ${styles.headerCell}`}>Период</div>
                                {histograms[0]?.data?.slice(0, 10).map((item, i) => (
                                    <div key={`date-${i}`} className={`${styles.histogramCell} ${styles.dateCell}`}>
                                        {new Date(item.date).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </div>
                                ))}
                            </div>

                            {histograms.map((histogram, index) => (
                                <div key={`data-${index}`} className={styles.histogramRow}>
                                    <div className={`${styles.histogramCell} ${styles.headerCell}`}>
                                        {histogram.histogramType === 'totalDocuments' ? 'Всего' : 'Риски'}
                                    </div>
                                    {histogram.data?.slice(0, 10).map((item, i) => (
                                        <div key={`value-${index}-${i}`} className={`${styles.histogramCell} ${styles.dataCell}`}>
                                            {item.value}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button onClick={scrollRight} className={styles.scrollButton} aria-label="Прокрутить вправо">
                        &gt;
                    </button>
                </div>
            </div>

            <div className={styles.publications}>
                <h3 className={styles.publicationsTitle}>Список документов</h3>
                
                {publications.length === 0 ? (
                    <div className={styles.noResults}>Ничего не найдено</div>
                ) : (
                    <>
                        <div className={styles.publicationsList}>
                            {publications.slice(0, visibleCount).map((pub, index) => {
                                if (!pub) return null;
                                const { safeText, safeMarkup } = getSafeContent(pub.content);
                                
                                return (
                                    <div key={index} className={styles.publicationCard}>
                                        <div className={styles.publicationHeader}>
                                            <div className={styles.publicationDate}>
                                                {pub.issueDate ? new Date(pub.issueDate).toLocaleDateString('ru-RU') : 'Дата не указана'}
                                            </div>
                                            <a 
                                                href={pub.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className={styles.publicationSource}
                                            >
                                                {pub.source?.name || 'Неизвестный источник'}
                                            </a>
                                        </div>
                                        
                                        <h4 className={styles.publicationTitle}>{pub.title.text || 'Без названия'}</h4>
                                        
                                        {pub.attributes && (
                                            <div className={styles.publicationTags}>
                                                {pub.attributes.isTechNews && (
                                                    <span className={styles.tag}>Технические новости</span>
                                                )}
                                                {pub.attributes.isAnnouncement && (
                                                    <span className={styles.tag}>Анонсы и события</span>
                                                )}
                                                {pub.attributes.isDigest && (
                                                    <span className={styles.tag}>Сводки новостей</span>
                                                )}
                                            </div>
                                        )}
                                        
                                        <div className={styles.publicationContent}>
                                            {safeMarkup ? (
                                                <div dangerouslySetInnerHTML={{ __html: safeMarkup }} className={styles.xmlContent} />
                                            ) : (
                                                <p>{safeText}</p>
                                            )}
                                        </div>
                                        
                                        <div className={styles.publicationFooter}>
                                            <a 
                                                href={pub.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className={styles.readButton}
                                            >
                                                Читать в источнике
                                            </a>
                                            {pub.attributes?.wordCount && (
                                                <span className={styles.wordCount}>
                                                    {pub.attributes.wordCount} слова
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {visibleCount < publications.length && (
                            <button 
                                onClick={loadMore} 
                                className={styles.loadMoreButton}
                            >
                                Показать больше
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Results;
